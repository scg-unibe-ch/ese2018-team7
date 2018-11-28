import {Component, OnInit, ViewChild} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import {debounceTime, map, tap} from 'rxjs/operators';
import {AuthService} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatSidenav, MatSidenavContainer} from '@angular/material';
import {Message} from './message';
import {MenuCountService} from './menuCount/menuCount.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/**
 * Component with the Head and Menu, merging everything together
 */
export class AppComponent implements OnInit {

  @ViewChild(MatSidenavContainer)
  matSidenavContainer: MatSidenavContainer;

  @ViewChild(MatSidenav)
  matSidenav: MatSidenav;

  menus = [
    {
      link: '/viewJobs', text: 'Job finden', condition: function () {
        return true;
      }, badgeVisible: false, badgeValue: function() {return null; }
    },
    {
      link: '/editJobs', text: 'Jobs verwalten', condition: function () {
        return AuthService.isLogin();
      }, badgeVisible: true, badgeValue: function() { return MenuCountService.getJobCount(); }
    },
    {
      link: '/editUsers', text: 'Benutzerverwaltung', condition: function () {
        return AuthService.isModOrAdmin();
      }, badgeVisible: true, badgeValue: function() { return MenuCountService.getUserCount(); }
    },
    {
      link: '/editAccount', text: 'Kontoeinstellungen', condition: function () {
        return AuthService.isLogin();
      }, badgeVisible: false, badgeValue: function() {return null; }
    },
  ];

  login = [
    {
      link: '/login', text: 'Login', condition: function () {
        return !AuthService.isLogin();
      }
    },
    {
      link: '/logout', text: 'Logout', condition: function () {
        return AuthService.isLogin();
      }
    },
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 950px)')
    .pipe(
      map(result => result.matches)
    );

  constructor(private httpClient: HttpClient, router: Router, private breakpointObserver: BreakpointObserver) {

    // Initialize the Authservice and update on every page change
    AuthService.update(httpClient);
    MenuCountService.update(httpClient);
    router.events.subscribe(() => {
      AuthService.forceUpdate(httpClient);
    });

    AuthService.observer().subscribe(() => {
      MenuCountService.update(this.httpClient);
      if (this.matSidenavContainer !== undefined && this.matSidenav !== undefined && this.matSidenav.mode === 'side') {
        this.matSidenavContainer._contentMargins.left = this.matSidenav._width - 1;
      }
    });
  }

  ngOnInit() {
    this.matSidenavContainer._contentMarginChanges.pipe(
      debounceTime(250), tap(() => {
        if (this.matSidenav.mode === 'side') {
          this.matSidenavContainer._contentMargins.left = this.matSidenav._width - 1;
        }
      }),
    ).subscribe();
  }

  getWelcomeText() {
    let welcomeText = '';
    if (AuthService.getUsername().length > 12) {
      welcomeText = 'Willkommen ' + AuthService.getUsername().substr(0, 10) + '... !';
    } else {
      welcomeText = 'Willkommen ' + AuthService.getUsername() + '!';
    }
    return welcomeText;
  }

  isLogin() {
    return AuthService.isLogin();
  }
}
