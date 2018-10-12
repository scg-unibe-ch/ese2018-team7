import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
/**
 * Logs the user out and redirect to /
 */
export class LogoutComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router) {
    this.httpClient.get('http://localhost:3000/login/logout', {withCredentials: true}).subscribe(
      (res: any) => {
          AuthService.forceUpdate(httpClient);
          this.router.navigate(['/']);
      }
    );
  }

  ngOnInit() {
  }

}
