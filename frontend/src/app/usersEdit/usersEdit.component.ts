import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {User} from '../user';
import {AuthService} from '../auth/auth.service';
import {Usergroup} from '../usergroup';
import {Company} from '../company';
import {MatDialog} from '@angular/material';
import {UsersEdit} from './usersEdit.interface';
import {UsersEditDataProvider} from './usersEdit.dataProvider';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-users-edit',
  templateUrl: './usersEdit.component.html',
  styleUrls: ['./usersEdit.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', maxHeight: '0px', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
/**
 * Component to allow admins to manage the users
 */
export class UsersEditComponent implements OnInit {

  displayedColumns: string[] = ['username', 'type'];

  // Default new admin
  user: User = new User( '', '', 0, true);

  // Array of users
  users: User[] = [];
  companys: Company[] = [];
  dataProvider: UsersEditDataProvider;
  expandedElement: UsersEdit;

  constructor(private httpClient: HttpClient, private router: Router, private dialog: MatDialog) {
    AuthService.allowOnlyModsAndAdmin(httpClient, router);
  }

  ngOnInit() {
    // Load all users from the server
    this.httpClient.get('/login/edit', {withCredentials: true}).subscribe((instances: any) => {
      this.users = instances.map((instance) => new User(instance.username, '', instance.type, instance.enabled, instance.suspended));
      this.companys = instances.map((instance) =>
        new Company(instance.username, instance.companyName, instance.companyLogo, instance.companyUnapprovedChanges));

      this.updateDataProvider();
    });
  }

  updateDataProvider() {
    const data: UsersEdit[] = [];
    this.users.map((u) => {
      const comp: Company = this.companys.filter(e => e.username === u.username)[0];
      data.push({user: u, company: comp});
    });
    this.dataProvider = new UsersEditDataProvider(data);

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
    this.httpClient.post('/login', {
      'username': this.user.username, 'password': this.user.password, 'type': usertype, 'enabled': 'true'
    }, {withCredentials: true}).subscribe(() => {
      this.user.password = '';
      this.users.push(this.user);
      this.user = new User( '', '',  0, true);
      this.updateDataProvider();
    });
  }

  /**
   * If the admin wants to delete a user
   * @param user
   */
  onDeleteUser(user: User) {
    if (confirm('Möchtest du diesen Benutzer wirklich löschen?')) {
      this.httpClient.delete('/login/' + user.username, {withCredentials: true}).subscribe(() => {
        this.users.splice(this.users.indexOf(user), 1);
        this.updateDataProvider();
      });
    }
  }


  /**
   * If you want to suspend a user
   * @param user
   */
  onSuspendUser(user: User) {
    if (confirm('Möchtest du diesen Benutzer und seine Jobs wirklich ' + (user.suspended ? 'reaktivieren' : 'sperren'))) {
      this.httpClient.put('/login/suspend/', {
        'username': user.username
      }, {withCredentials: true}).subscribe((res: any) => {
        user.suspended = res.suspended;
        this.updateDataProvider();
      });
    }
  }

  /**
   * If the admin accepts an employer
   */
  onAcceptUser(user: User) {
    this.httpClient.put('/login/accept', {
      'username': user.username
    }, {withCredentials: true}).subscribe(() => {
      user.enabled = true;
      this.updateDataProvider();
    });
  }

  /**
   * If the admin wants to reset the password of a user
   */
  onResetPassword(user: User) {
    console.log(user);
    this.httpClient.put('/login/setPassword', {
      'username': user.username, 'password': user.password
    }, {withCredentials: true}).subscribe(() => {
      user.password = '';
      this.updateDataProvider();
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

  onApproveCompany(company: Company) {

    this.httpClient.put('/login/company/accept', {
      'username': company.username
    }, {withCredentials: true}).subscribe(() => {
      company.unapprovedChanges = false;
    });

  }

}
