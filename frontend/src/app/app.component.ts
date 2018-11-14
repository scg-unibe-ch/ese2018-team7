import {Component, OnInit, ViewChild} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import {debounceTime, map, tap} from 'rxjs/operators';
import {AuthService} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatSidenav, MatSidenavContainer} from '@angular/material';
import {Message} from './message';

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

  jobCount: number;

  menus = [
    {
      link: '/viewJobs', text: 'Job finden', condition: function () {
        return true;
      }
    },
    {
      link: '/editJobs', text: 'Jobs verwalten', condition: function () {
        return AuthService.isLogin();
      }
    },
    {
      link: '/editUsers', text: 'Benutzerverwaltung', condition: function () {
        return AuthService.isModOrAdmin();
      }
    },
    {
      link: '/editAccount', text: 'Kontoeinstellungen', condition: function () {
        return AuthService.isLogin();
      }
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
    router.events.subscribe(() => {
      AuthService.forceUpdate(httpClient);
    });

    AuthService.observer().subscribe(() => {
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

  getJobCount() {
    if (AuthService.isLogin() && this.jobCount == null) {
      this.httpClient.get('/login/jobCount', {withCredentials: true}).subscribe(
        (res: number) => {
          console.log(res);
          this.jobCount = res;
        },
        err => {
          this.jobCount = null;
          console.log('Error occurred:' + err.error.message);
        }
      );
    }
    return this.jobCount;
  }
}
