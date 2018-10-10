import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  menus = [
    {link: '/viewJobs', text: 'View Jobs', condition: function() {return !AuthService.isLogin(); }},
    {link: '/editJobs', text: 'Edit Jobs', condition: function() {return AuthService.isLogin(); }},
    {link: '/changePassword', text: 'Change Password', condition: function() {return AuthService.isLogin(); }},
    {link: '/login', text: 'Login', condition: function() {return !AuthService.isLogin(); }},
    {link: '/logout', text: 'Logout', condition: function() {return AuthService.isLogin(); }},
    ];

// <a routerLink="/changePassword" routerLinkActive="{{changePassword}}">Change Password</a>
  loggedin = false;

  logInOutLink = '/login';
  logInOutText = 'Login';

  jobViewEditLink = '/viewJobs';
  jobViewEditText = 'View Jobs';

  changePassword = 'disabled';

  constructor(private httpClient: HttpClient, router: Router) {
    this.onUpdate({'id': ''});
    router.events.subscribe((val) => {
      // see also
      this.onUpdate(val);
    });
    // r
  }

  ngOnInit() {
  }
  onUpdate(params:  any) {
    console.log('update menu ' + params['id']);

    this.httpClient.get('http://localhost:3000/login/check', {withCredentials: true}).subscribe(
      (res: any) => {
        if (res.value === null || res.value !== 'true') {
          if (this.loggedin === true) {
            this.logInOutLink = '/login';
            this.logInOutText = 'Login';

            this.jobViewEditLink = '/viewJobs';
            this.jobViewEditText = 'View Jobs';

            this.changePassword = 'disabled';
          }
          this.loggedin = false;

        } else {
          if (this.loggedin === false) {
            this.logInOutLink = '/logout';
            this.logInOutText = 'Logout';

            this.jobViewEditLink = '/editJobs';
            this.jobViewEditText = 'Edit Jobs';

            this.changePassword = 'active';
          }

          this.loggedin = true;

        }
      }
    );

  }

}
