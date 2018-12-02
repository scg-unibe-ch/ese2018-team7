import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {User} from '../user';
import {AuthService} from '../auth/auth.service';
import {Usergroup} from '../usergroup';
import {Company} from '../company';
import {UsersEdit} from './usersEdit.interface';
import {UsersEditDataProvider} from './usersEdit.dataProvider';
import {Message} from '../message';
import {ConfirmDialogComponent} from '../confirmDialog/confirmDialog.component';
import {MenuCountService} from '../menuCount/menuCount.service';

/**
 * Component to allow administrators to manage all the users
 */
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

export class UsersEditComponent implements OnInit {

  /**
   * Array ot the two columns that are displayed in the user overview section
   */
  displayedColumns: string[] = ['username', 'type'];

  /**
   * New administrators and moderators can be created
   *
   * By default a new administrator is created
   */
  user: User = new User( '', '', Usergroup.moderator, true);

  /**
   * Array of all users
   */
  users: User[] = [];

  /**
   * Array of all companies
   */
  companys: Company[] = [];

  /**
   * Data provider to fill the table with all the user data dynamically
   */
  dataProvider: UsersEditDataProvider;

  /**
   * Expandable with the user that is currently selected (to be edited)
   */
  expandedElement: UsersEdit;

  /**
   * Sorting criterion that the user has selected, default is "username ascending"
   */
  sorting = 'usernameASC';

  /**
   * Create a new instance of this component with the provided parameters
   * @param httpClient
   * @param router
   * @param dialog Dialog to ask the user for confirmation
   * @param snackBar SnackBar to present messages to the user
   */
  constructor(private httpClient: HttpClient, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) {
    AuthService.allowOnlyModsAndAdmin(httpClient, router);
  }

  /**
   * Initialise the component by loading all users from the server and passing them on to the data provider
   */
  ngOnInit() {
    // Load all users from the server
    this.httpClient.get('/login/edit', {withCredentials: true}).subscribe((instances: any) => {
      this.users = instances.map((instance) =>
        new User(instance.username, '', instance.type, instance.enabled, instance.suspended));
      this.companys = instances.map((instance) =>
        new Company(instance.username, instance.companyName, instance.companyEmail, instance.companyLogo,
          instance.companyUnapprovedChanges));
      this.updateDataProvider();
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }

  /**
   * Update the data provider if there are changes to the user list
   */
  updateDataProvider() {
    const data: UsersEdit[] = [];
    this.users.map((u) => {
      const comp: Company = this.companys.filter(e => e.username === u.username)[0];
      data.push({user: u, company: comp});
    });
    this.dataProvider = new UsersEditDataProvider(data, this.sorting);
    MenuCountService.update(this.httpClient);
  }

  /**
   * Create a new administrator
   */
  onCreateAdmin() {
    this.onCreate(Usergroup.administrator);
  }

  /**
   * Create a new moderator
   */
  onCreateMod() {
    this.onCreate(Usergroup.moderator);
  }

  /**
   * Check if all necessary details are provided and then send the user creation request to the server
   * @param usertype Type of the user that should be created (admin/mod)
   */
  onCreate(usertype: Usergroup) {
    if (this.user.username === '' || this.user.password === '') {
      this.snackBar.open('Leerer Benutzername / Password ist nicht erlaubt!', null, {duration: 5000});
      return;
    }

    this.httpClient.post('/login', {
      'username': this.user.username, 'password': this.user.password, 'type': usertype, 'enabled': 'true'
    }, {withCredentials: true}).subscribe(() => {
      this.user.password = '';
      this.user.type = usertype;
      this.users.push(this.user);
      this.user = new User( '', '', Usergroup.moderator, true);
      this.updateDataProvider();
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }

  /**
   * Delete the specified user after confirmation by the user
   * @param user User that should be deleted
   */
  onDeleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        msg: 'Möchtest du diesen Benutzer wirklich löschen?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog
      if (result === 'confirm') {
        this.httpClient.delete('/login/' + user.username, {withCredentials: true}).subscribe(() => {
          this.users.splice(this.users.indexOf(user), 1);
          this.updateDataProvider();
        }, err => {
          console.error(err.error.message);
          this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
        });
      }
    });
  }

  /**
   * Suspend the specified user after confirmation by the user
   * @param user User that should be suspended
   */
  onSuspendUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
     data: {
        msg: 'Möchtest du diesen Benutzer und seine Jobs wirklich ' + (user.suspended ? 'reaktivieren' : 'sperren') + '?',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // The result can also be nothing if the user presses the `esc` key or clicks outside the dialog
      if (result === 'confirm') {
        this.httpClient.put('/login/suspend/', {
          'username': user.username
        }, {withCredentials: true}).subscribe((res: any) => {
          user.suspended = res.suspended;
          this.updateDataProvider();
        }, err => {
          console.error(err.error.message);
          this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
        });
      }
    });
  }

  /**
   * Accept the specified user
   * @param user User that should be accepted
   */
  onAcceptUser(user: User) {
    this.httpClient.put('/login/accept', {
      'username': user.username
    }, {withCredentials: true}).subscribe(() => {
      user.enabled = true;
      this.updateDataProvider();
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }

  /**
   * Reset the password of the specified user
   * @param user User who's password should be reset
   */
  onResetPassword(user: User) {
    console.log(user);
    this.httpClient.put('/login/setPassword', {
      'username': user.username, 'password': user.password
    }, {withCredentials: true}).subscribe(() => {
      user.password = '';
      this.updateDataProvider();
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
    this.snackBar.open('Das Passwort von ' + user.username + ' wurde geändert.', null, {duration: 5000});
  }

  /**
   * Approve changes that have been made to the company details of an employer
   * @param company Company that should be approved
   */
  onApproveCompany(company: Company) {
    this.httpClient.put('/login/company/accept', {
      'username': company.username
    }, {withCredentials: true}).subscribe(() => {
      company.unapprovedChanges = false;
      MenuCountService.update(this.httpClient);
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }

  /**
   * Check if logged in user is an administrator
   * @returns Flag if user is admin
   */
  isAdmin(): boolean {
    return AuthService.isAdmin();
  }

  /**
   * Get the string representation of the userType, so it can be shown in the table
   * @param type userType that should be represented in string format
   * @returns String representation of userType
   */
  getUserTypeString(type: Usergroup): string {
    switch (type) {
      case 1: {
        return 'Administrator';
      }
      case 3: {
        return 'Moderator';
      }
      case 5: {
        return 'Unternehmen';
      }
      case 7: {
        return 'Öffentlich';
      }
      default: {
        console.log('Invalid Usergroup! ' + type);
        break;
      }
    }
  }

  /**
   * Check if logged in user matches a specified user
   * @param user User that should be compared
   * @returns Flag if user matches
   */
  isMe(user): boolean {
    return AuthService.isMe(user);
  }

  /**
   * Check if a specified user is of UserGroup `employer`
   * @param user User that should be checked
   * @returns Flag if user is employer
   */
  isEmployer(user): boolean {
    return user.type === Usergroup.employer;
  }

  /**
   * Check if a specified user is of UserGroup `administrator`
   * @param user User that should be checked
   * @returns Flag if user is admin
   */
  isUserAdmin(user): boolean {
    return user.type === Usergroup.administrator;
  }

  /**
   * Open default email client with new email to specified email address
   * @param email Email address of recipient
   */
  sendMail(email) {
    window.location.href = 'mailto:' + email;
  }

}
