import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {User} from './user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  menus = [
    {link: '/viewJobs', text: 'View Jobs', condition: function() {return !AuthService.isLogin(); }},
    {link: '/editJobs', text: 'Edit Jobs', condition: function() {return AuthService.isLogin(); }},
    {link: '/editUsers', text: 'Edit Users', condition: function() {return AuthService.isAdmin(); }},
    {link: '/changePassword', text: 'Change Password', condition: function() {return AuthService.isLogin(); }},
    {link: '/login', text: 'Login', condition: function() {return !AuthService.isLogin(); }},
    {link: '/logout', text: 'Logout', condition: function() {return AuthService.isLogin(); }},
    ];

  constructor(private httpClient: HttpClient, router: Router) {
    this.updateAuth();
    router.events.subscribe(() => {
      this.updateAuth();
    });
  }

  ngOnInit() {
  }

  updateAuth() {
    this.httpClient.get('http://localhost:3000/login/check', {withCredentials: true}).subscribe(
      (res: any) => {
        console.log(res);
        AuthService.setLogin(res.value === 'true' , res.value === 'true' && res.admin === 'true');
      },
      err => {
        console.log('Error occurred:' + err);
        if (err.error.message != null) {
          alert(err.error.message);
        }
      }
    );
  }

}
