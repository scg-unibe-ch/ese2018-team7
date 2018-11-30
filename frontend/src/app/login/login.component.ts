import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Message} from '../message';
import {MatSnackBar} from '@angular/material';
import {Usergroup} from '../usergroup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
/**
 * Component provides a Login-form to login on the Page
 */
export class LoginComponent implements OnInit {

  user: User;
  @Output()
  destroy = new EventEmitter<User>();

  constructor(private httpClient: HttpClient, private router: Router, private snackBar: MatSnackBar) {
    // Only allow non registered users to visit
    AuthService.allowOnlyPublic(httpClient, router);

    // Set User without username and password
    this.user = new User( '', '', Usergroup.public, true);
  }

  ngOnInit() {
  }

  /**
   * If the user wants to login with the given credentials
   */
  onLogin() {
    if (this.checkForCookie()) {
      if (this.user.username !== '' && this.user.password !== '') {
        this.httpClient.get('/login/' + this.user.username + '/' + this.user.password, {withCredentials: true}).subscribe(
          (res: User) => {
            console.log(res);
            AuthService.forceUpdate(this.httpClient);
            this.router.navigate(['/']);
          },
          err => {
            console.log('Error occurred:' + err.error.message);
            this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
          }
        );
      } else {
        this.snackBar.open('Du musst beide Felder ausfüllen!', null, {duration: 5000});
      }
    } else {
      this.snackBar.open('Du musst zuerst Cookies akzeptieren!', null, {duration: 5000});
    }
  }

  /**
   * If the user wants to register -> Redirect
   */
  toRegistration() {
    this.router.navigate(['/registration']);
  }

  checkForCookie(): boolean {
    const name = 'cookieconsent_status=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return true;
      }
    }
    return false;
  }

}
