import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loggedin = false;

  logInOutLink = '/login';
  logInOutText = 'Login';

  jobViewEditLink = '/viewJobs';
  jobViewEditText = 'View Jobs';

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
          }
          this.loggedin = false;

        } else {
          if (this.loggedin === false) {
            this.logInOutLink = '/logout';
            this.logInOutText = 'Logout';

            this.jobViewEditLink = '/editJobs';
            this.jobViewEditText = 'Edit Jobs';
          }

          this.loggedin = true;

        }
      }
    );

  }

}
