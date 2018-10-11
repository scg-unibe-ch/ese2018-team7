import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage;

  @Input()
  user: User;
  @Output()
  destroy = new EventEmitter<User>();

  constructor(private httpClient: HttpClient, private router: Router) {
    if (AuthService.isLogin()) {
      this.router.navigate(['/']);
    }
    this.user = new User( '', '', null, null);
  }

  ngOnInit() {
  }

  onLogin() {
    this.httpClient.get('http://localhost:3000/login/' + this.user.username + '/' + this.user.password, {withCredentials: true}).subscribe(
      (res: User) => {
        console.log(res);
        AuthService.setLogin(true, res.type != null && res.type === 0 );
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

  toRegister() {
    this.router.navigate(['/register']);
  }

}
