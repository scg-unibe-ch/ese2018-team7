import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {User} from '../user';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-users-edit',
  templateUrl: './usersEdit.component.html',
  styleUrls: ['./usersEdit.component.css']
})
export class UsersEditComponent implements OnInit {

  user: User = new User( '', '', 0, true);
  users: User[] = [];

  constructor(private httpClient: HttpClient, private router: Router) {
    if (!AuthService.isAdmin()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/login', {withCredentials: true}).subscribe((instances: any) => {
      this.users = instances.map((instance) => new User(instance.username, '', instance.type, instance.enabled));
    });
  }

  onCreateAdmin() {
    this.httpClient.post('http://localhost:3000/login', {
      'username': this.user.username, 'password': this.user.password, 'type': '0', 'enabled': 'true'
    }, {withCredentials: true}).subscribe(() => {
      this.user.password = '';
      this.users.push(this.user);
      this.user = new User( '', '',  0, true);
    });
  }
  onDeleteUser(user: User) {
    this.httpClient.delete('http://localhost:3000/login/' + user.username, {withCredentials: true}).subscribe(() => {
      this.users.splice(this.users.indexOf(user), 1);
    });

  }
  onAcceptUser(user: User) {
    this.httpClient.put('http://localhost:3000/login/accept', {
      'username': user.username
    }, {withCredentials: true}).subscribe(() => {
      user.enabled = true;
    });
  }
  onResetPassword(user: User) {
    console.log(user);
    this.httpClient.put('http://localhost:3000/login/setPassword', {
      'username': user.username, 'password': user.password
    }, {withCredentials: true}).subscribe(() => {
      user.password = '';
    });
  }

}
