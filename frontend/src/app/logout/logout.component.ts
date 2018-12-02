import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';

import {AuthService} from '../auth/auth.service';
import {Message} from '../message';

/**
 * Component that is shown upon logout of a user
 */
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})

export class LogoutComponent implements OnInit {

  /**
   * Logout the user and redirect him to /
   * @param httpClient
   * @param router
   * @param snackBar SnackBar to display any eventual error messages to the useer
   */
  constructor(private httpClient: HttpClient, private router: Router, private snackBar: MatSnackBar) {
    this.httpClient.get('/login/logout', {withCredentials: true}).subscribe(
      (res: any) => {
          AuthService.forceUpdate(httpClient);
          this.router.navigate(['/']);
      }, err => {
        console.error(err.error.message);
        this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
      }
    );
  }

  /**
   * @ignore
   */
  ngOnInit() {
  }

}
