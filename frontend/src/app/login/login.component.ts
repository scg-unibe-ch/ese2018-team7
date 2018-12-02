import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';

import {User} from '../user';
import {Usergroup} from '../usergroup';
import {AuthService} from '../auth/auth.service';
import {Message} from '../message';

/**
 * Component that provides a Login-form to login into the private areas of the application
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  /**
   * Stores user information if the user logs in
   */
  user: User;

  /**
   * Simple EventEmitter to destroy component
   */
  @Output()
  destroy = new EventEmitter<User>();

  /**
   * Initialise component with given parameters and create an "empty" `user`
   * @param httpClient
   * @param router
   * @param snackBar Snackbar to present error/success messages to the user
   */
  constructor(private httpClient: HttpClient, private router: Router, private snackBar: MatSnackBar) {
    // Only allow non registered users to visit
    AuthService.allowOnlyPublic(httpClient, router);

    // Set User without username and password
    this.user = new User( '', '', Usergroup.public, true);
  }

  /**
   * Check if user has accepted cookie policy, otherwise we deny login,
   * because by law we are not allowed to save cookies if he refuses to consent.
   * @returns Boolean if user has accepted cookie policy or not
   */
  static checkForCookie(): boolean {
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

  /**
   * @ignore
   */
  ngOnInit() {
  }

  /**
   * Login user with the given credentials
   */
  onLogin() {
    if (LoginComponent.checkForCookie()) {
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
        this.snackBar.open('Bitte beide Felder ausfüllen!', null, {duration: 5000});
      }
    } else {
      this.snackBar.open('Bitte zuerst Cookies akzeptieren!', null, {duration: 5000});
    }
  }

  /**
   * Redirect user to registration page
   */
  toRegistration() {
    this.router.navigate(['/registration']);
  }

}
