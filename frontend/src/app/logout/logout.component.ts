import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router) {
    this.httpClient.get('http://localhost:3000/login/logout', {withCredentials: true}).subscribe(
      (res: any) => {
          AuthService.setLogin(false);
          this.router.navigate(['/']);
      }
    );
  }

  ngOnInit() {
  }

}
