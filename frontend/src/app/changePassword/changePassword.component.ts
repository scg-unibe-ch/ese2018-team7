import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.css']
})
export class ChangePasswordComponent implements OnInit {

  @Input()
  msg: String;
  password: String;
  password2: String;
  @Output()
  destroy = new EventEmitter<User>();

  constructor(private httpClient: HttpClient, private router: Router) {
    if (!AuthService.isLogin()) {
      this.router.navigate(['/login']);
    }
  }


  ngOnInit() {
  }

  onSave() {
    if (this.password === this.password2) {
      this.msg = '';
      this.httpClient.put('http://localhost:3000/login/password', {'password': this.password}, {withCredentials: true}).subscribe(
        res => {
          console.log(res);
          this.msg = 'new Password saved';
        },
        err => {
          console.log('Error occurred:' + err);
          this.msg = 'Failed to save the new Password!';
        }
      );
    } else {
      this.msg = 'Passwords not equal';
    }
  }

}
