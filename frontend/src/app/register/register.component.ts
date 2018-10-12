import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

/**
 * Component to register employer
 */
export class RegisterComponent implements OnInit {

  errorMessage;

  user: User;
  @Output()
  destroy = new EventEmitter<User>();

  constructor(private httpClient: HttpClient, private router: Router) {
    AuthService.allowOnlyPublic(httpClient, router);
  }

  ngOnInit() {
    // Set 'empty' User
    this.user = new User( '', '', 1 , false);
  }

  /**
   * If the user wants to register with the given credentials
   */
  onCreate() {
    this.httpClient.post('http://localhost:3000/login/', {
      'username': this.user.username, 'password': this.user.password, 'type': '1', 'enabled': 'false'
    }, {withCredentials: true}).subscribe((res: any) => {
        console.log(res);
        if (res.message != null) {
          alert(res.message);
        }
        this.router.navigate(['/']);
      },
      (err: any) => {
        console.error(err);
        this.errorMessage = err.error.errorMessage;
        if (err.error.message != null) {
          alert(err.error.message);
        }
      });
  }
}
