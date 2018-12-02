import {Component, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {debounceTime, map, tap} from 'rxjs/operators';
import {AuthService} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatSidenav, MatSidenavContainer} from '@angular/material';

import {MenuCountService} from './menuCount/menuCount.service';

/**
 * Root component of this application consisting of header bar, menu and content
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  /**
   * Container for sidenav and main content
   */
  @ViewChild(MatSidenavContainer)
  matSidenavContainer: MatSidenavContainer;

  /**
   * Sidenav which contains the menu
   */
  @ViewChild(MatSidenav)
  matSidenav: MatSidenav;

  /**
   * Array of each menupoint with its corresponding properties and visibility constraints
   */
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

  /**
   * Array of possible login states and the corresponding text for the login button
   */
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

  /**
   * Boolean observable to determine if the user is using a mobile device
   */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 950px)')
    .pipe(
      map(result => result.matches)
    );

  /**
   * Main constructor, initialises the global AuthService and MenuCountService
   * @param httpClient
   * @param router
   * @param breakpointObserver
   */
  constructor(private httpClient: HttpClient, router: Router, private breakpointObserver: BreakpointObserver) {

    // Initialise the Authservice and update on every page change
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

  /**
   * Initialises the sidebar and collapses the sidebar if the screensize is too small
   */
  ngOnInit() {
    this.matSidenavContainer._contentMarginChanges.pipe(
      debounceTime(250), tap(() => {
        if (this.matSidenav.mode === 'side') {
          this.matSidenavContainer._contentMargins.left = this.matSidenav._width - 1;
        }
      }),
    ).subscribe();
  }

  /**
   * Generates the welcome text that is displayed in the menu to welcome the user
   * @returns Welcome text
   */
  getWelcomeText(): string {
    let welcomeText = '';
    if (AuthService.getUsername().length > 12) {
      welcomeText = 'Willkommen ' + AuthService.getUsername().substr(0, 10) + '... !';
    } else {
      welcomeText = 'Willkommen ' + AuthService.getUsername() + '!';
    }
    return welcomeText;
  }

  /**
   * Checks if a user is currently logged in
   * @returns true if user is logged in, false else
   */
  isLogin(): boolean {
    return AuthService.isLogin();
  }
}
