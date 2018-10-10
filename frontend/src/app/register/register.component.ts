import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ajaxGetJSON} from 'rxjs/internal/observable/dom/AjaxObservable';
import {jsonpFactory} from '@angular/http/src/http_module';
import {serialize} from '@angular/compiler/src/i18n/serializers/xml_helper';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input()
  user: User;
  @Output()
  destroy = new EventEmitter<User>();

  constructor(private httpClient: HttpClient, private router: Router) {

  }

  ngOnInit() {
    this.user = new User(null, '', '', null);
  }

  onCreate() {
    this.httpClient.post('http://localhost:3000/login/', {
      'username': this.user.username, 'password': this.user.password, 'type': this.user.type
    }, {withCredentials: true}).subscribe((res: any) => {
        console.log(res);
        AuthService.setLogin(true);
        this.router.navigate(['/']);
      },
      (err: any) => {
        console.error(err);
        if (err.error.message != null) {
          alert(err.error.message);
        }
      });
  }
}
