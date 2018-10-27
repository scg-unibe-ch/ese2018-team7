import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-users-edit-company-view',
  templateUrl: './usersEditCompanyView.component.html',
  styleUrls: ['./usersEditCompanyView.component.css']
})
/**
 * Component to allow admins to manage the users
 */
export class UsersEditCompanyViewComponent implements OnInit {

  constructor(private httpClient: HttpClient,
              public dialogRef: MatDialogRef<UsersEditCompanyViewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }


  onApproveCompany() {

    this.httpClient.put('http://localhost:3000/login/company/accept', {
      'username': this.data.company.username
    }, {withCredentials: true}).subscribe(() => {
      this.data.company.unapprovedChanges = false;
    });

    this.dialogRef.close();

  }

}
