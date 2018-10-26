import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {User} from '../user';
import {AuthService} from '../auth/auth.service';
import {Usergroup} from '../usergroup';
import {Company} from '../company';
import {ModalService} from '../modal/modal.service';

@Component({
  selector: 'app-users-edit',
  templateUrl: './usersEdit.component.html',
  styleUrls: ['./usersEdit.component.css']
})
/**
 * Component to allow admins to manage the users
 */
export class UsersEditComponent implements OnInit {

  displayedColumns: string[] = ['username', 'type', 'password', 'action'];

  // Default new admin
  user: User = new User( '', '', 0, true);

  // Array of users
  users: User[] = [];
  companys: Company[] = [];

  constructor(private httpClient: HttpClient, private router: Router, private modalService: ModalService) {
    AuthService.allowOnlyModsAndAdmin(httpClient, router);
  }

  ngOnInit() {
    // Load all users from the server
    this.httpClient.get('http://localhost:3000/login/edit', {withCredentials: true}).subscribe((instances: any) => {
      this.users = instances.map((instance) => new User(instance.username, '', instance.type, instance.enabled, instance.suspended));
      this.companys = instances.map((instance) =>
        new Company(instance.username, instance.companyName, instance.companyLogo, instance.companyUnapprovedchanges));
    });
  }

  onCreateAdmin() {
    this.onCreate(Usergroup.administrator);
  }
  onCreateMod() {
    this.onCreate(Usergroup.moderator);
  }
  /**
   * If the admin wants to add a new admin
   */
  onCreate(usertype: Usergroup) {
    this.httpClient.post('http://localhost:3000/login', {
      'username': this.user.username, 'password': this.user.password, 'type': usertype, 'enabled': 'true'
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
    if (confirm('Möchtest du diesen Benutzer wirklich löschen?')) {
      this.httpClient.delete('http://localhost:3000/login/' + user.username, {withCredentials: true}).subscribe(() => {
        this.users.splice(this.users.indexOf(user), 1);
      });
    }
  }


  /**
   * If you want to suspend a user
   * @param user
   */
  onSuspendUser(user: User) {
    if (confirm('Möchtest du diesen Benutzer und seine Jobs wirklich ' + (user.suspended ? 'reaktivieren' : 'sperren'))) {
      this.httpClient.put('http://localhost:3000/login/suspend/', {
        'username': user.username
      }, {withCredentials: true}).subscribe((res: any) => {
        user.suspended = res.suspended;
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

  onApproveCompany(company: Company) {
    this.httpClient.put('http://localhost:3000/login/company/accept', {
      'username': company.username
    }, {withCredentials: true}).subscribe(() => {
      company.unapprovedChanges = false;
    });
  }

  isAdmin() {
    return AuthService.isAdmin();
  }

  getUserTypeString(type: Usergroup): string {
    return Usergroup[type];
  }
  isMe(user) {
    return AuthService.isMe(user);
  }
  isEmployer(user) {
    return user.type === Usergroup.employer;
  }
  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
