import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/**
 * Component with the Head and Menu, merging everything together
 */
export class AppComponent implements OnInit {

  menus = [
    {link: '/viewJobs', text: 'View Jobs', condition: function() {return true; }},
    {link: '/editJobs', text: 'Edit Jobs', condition: function() {return AuthService.isLogin(); }},
    {link: '/editUsers', text: 'Edit Users', condition: function() {return AuthService.isAdmin(); }},
    {link: '/changePassword', text: 'Change Password', condition: function() {return AuthService.isLogin(); }},
    {link: '/login', text: 'Login', condition: function() {return !AuthService.isLogin(); }},
    {link: '/logout', text: 'Logout', condition: function() {return AuthService.isLogin(); }},
    ];

  constructor(private httpClient: HttpClient, router: Router) {

    // Initialize the Authservice and update on every page change
    AuthService.update(httpClient);
    router.events.subscribe(() => {
      AuthService.forceUpdate(httpClient);
    });
  }

  ngOnInit() {
  }

}
