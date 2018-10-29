import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
/**
 * Component provides a Login-form to login on the Page
 */
export class LoginComponent implements OnInit {

  errorMessage;

  user: User;
  @Output()
  destroy = new EventEmitter<User>();

  constructor(private httpClient: HttpClient, private router: Router) {
    // Only allow non registered users to visit
    AuthService.allowOnlyPublic(httpClient, router);

    // Set User without username and password
    this.user = new User( '', '', null, null);
  }

  ngOnInit() {
  }

  /**
   * If the user wants to login with the given credentials
   */
  onLogin() {
    this.httpClient.get('/login/' + this.user.username + '/' + this.user.password, {withCredentials: true}).subscribe(
      (res: User) => {
        console.log(res);
        AuthService.forceUpdate(this.httpClient);
        this.router.navigate(['/']);
      },
      err => {
        console.log('Error occurred:' + err);
        this.errorMessage = err.error.errorMessage;
        if (err.error.message != null) {
          alert(err.error.message);
        }
      }
    );
  }

  /**
   * If the user wants to register -> Redirect
   */
  toRegistration() {
    this.router.navigate(['/registration']);
  }

}
