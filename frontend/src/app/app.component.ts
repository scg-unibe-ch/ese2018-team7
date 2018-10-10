import {Component, OnInit} from '@angular/core';
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

  constructor() {
  }

  ngOnInit() {
  }

}
