import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input()
  user: User;
  @Output()
  destroy = new EventEmitter<User>();

  constructor(private httpClient: HttpClient, private router: Router) {
    this.user = new User(null, '', '', null);
  }

  ngOnInit() {
  }

  onLogin() {
    this.httpClient.get('http://localhost:3000/login/' + this.user.username + '/' + this.user.password, {withCredentials: true}).subscribe(
      res => {
        console.log(res);
        AuthService.setLogin(true);
        this.router.navigate(['/']);
      },
      err => {
        console.log('Error occurred:' + err);
      }
    );
  }

  toRegister() {
    this.router.navigate(['/register']);
  }

}
