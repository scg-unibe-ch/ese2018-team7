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
/**
 * Component to allow admins to manage the users
 */
export class UsersEditComponent implements OnInit {

  // Default new admin
  user: User = new User( '', '', 0, true);

  // Array of users
  users: User[] = [];

  constructor(private httpClient: HttpClient, private router: Router) {
    AuthService.allowOnlyAdmin(httpClient, router);
  }

  ngOnInit() {
    // Load all users from the server
    this.httpClient.get('http://localhost:3000/login', {withCredentials: true}).subscribe((instances: any) => {
      this.users = instances.map((instance) => new User(instance.username, '', instance.type, instance.enabled));
    });
  }

  /**
   * If the admin wants to add a new admin
   */
  onCreateAdmin() {
    this.httpClient.post('http://localhost:3000/login', {
      'username': this.user.username, 'password': this.user.password, 'type': '0', 'enabled': 'true'
    }, {withCredentials: true}).subscribe(() => {
      this.user.password = '';
      this.users.push(this.user);
      this.user = new User( '', '',  0, true);
    });
  }

  /**
   * If the admin wants to delete a user
   * @param user
   */
  onDeleteUser(user: User) {
    if (confirm('Do you really want to delete this user?')) {
      this.httpClient.delete('http://localhost:3000/login/' + user.username, {withCredentials: true}).subscribe(() => {
        this.users.splice(this.users.indexOf(user), 1);
      });
    }
  }

  /**
   * If the admin accepts an employer
   */
  onAcceptUser(user: User) {
    this.httpClient.put('http://localhost:3000/login/accept', {
      'username': user.username
    }, {withCredentials: true}).subscribe(() => {
      user.enabled = true;
    });
  }

  /**
   * If the admin wants to reset the password of a user
   */
  onResetPassword(user: User) {
    console.log(user);
    this.httpClient.put('http://localhost:3000/login/setPassword', {
      'username': user.username, 'password': user.password
    }, {withCredentials: true}).subscribe(() => {
      user.password = '';
    });
  }

}
