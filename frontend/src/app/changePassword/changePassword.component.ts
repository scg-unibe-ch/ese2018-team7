import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.css']
})
/**
 * Form to change the password of the current user
 */
export class ChangePasswordComponent implements OnInit {

  @Input()
  msg: String;
  password: String;
  password2: String;
  @Output()
  destroy = new EventEmitter<User>();


  constructor(private httpClient: HttpClient, private router: Router) {
    // Only accessible for logged-in users
    AuthService.allowOnlyLogin(httpClient, router);
  }


  ngOnInit() {
  }

  /**
   * Try to save the new password
   */
  onSave() {

    // Check if the passwords are identical
    if (this.password === this.password2) {
      this.msg = '';

      // Save to Server
      this.httpClient.put('/login/password', {'password': this.password}, {withCredentials: true}).subscribe(
        res => {
          console.log(res);
          this.msg = 'Neues Passwort gespeichert!';
        },
        err => {
          console.log('Error occurred:' + err);
          this.msg = 'Das neue Passwort konnte nicht gespeichert werden!';
        }
      );
    } else {
      this.msg = 'Passwörter stimmen nicht überein!';
    }
  }

}
