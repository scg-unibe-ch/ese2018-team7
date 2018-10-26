import {Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    {link: '/viewJobs', text: 'Job finden', condition: function() {return true; }},
    {link: '/editJobs', text: 'Jobs verwalten', condition: function() {return AuthService.isLogin(); }},
    {link: '/editUsers', text: 'Benutzerverwaltung', condition: function() {return AuthService.isModOrAdmin(); }},
    {link: '/editCompany', text: 'Firma verwalten', condition: function() {return AuthService.isEmployer(); }},
    {link: '/changePassword', text: 'Kontoeinstellungen', condition: function() {return AuthService.isLogin(); }},
    ];

  login = [
    {link: '/login', text: 'Login', condition: function() {return !AuthService.isLogin(); }},
    {link: '/logout', text: 'Logout', condition: function() {return AuthService.isLogin(); }},
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private httpClient: HttpClient, router: Router, private breakpointObserver: BreakpointObserver) {

    // Initialize the Authservice and update on every page change
    AuthService.update(httpClient);
    router.events.subscribe(() => {
      AuthService.forceUpdate(httpClient);
    });
  }

  ngOnInit() {
  }

}
