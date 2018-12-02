import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatSnackBar} from '@angular/material';

import {User} from '../user';
import {AuthService} from '../auth/auth.service';
import {Company} from '../company';
import {Message} from '../message';
import {SelectLogoComponent} from '../selectLogo/selectLogo.component';

/**
 * Component to edit the account settings of the currently logged in user
 */
@Component({
  selector: 'app-company-edit',
  templateUrl: './accountSettings.component.html',
  styleUrls: ['./accountSettings.component.css']
})

export class AccountSettingsComponent implements OnInit {

  /**
   * Company of which the information is displayed and edited in the first section
   */
  @Input()
  company: Company;

  /**
   * New password that can be entered
   */
  password: String;

  /**
   * Confirmation of new password
   */
  password2: String;

  /**
   * Progress bar for displaying the progress of loading the logos from the web
   */
  showProgressBar = false;

  /**
   * Simple EventEmitter to delete this component
   */
  @Output()
  destroy = new EventEmitter<User>();

  /**
   * Create a new instance of this component and determine if the user is logged in
   * @param httpClient
   * @param router
   * @param snackBar SnackBar to display messages to the user
   * @param dialog Dialog windows to display a selection of logos from the web
   */
  constructor(private httpClient: HttpClient, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {
    // Only accessible for employer
    AuthService.allowOnlyLogin(httpClient, router);
    this.company = new Company();
  }

  /**
   * Initialise this component by loading the company data from the server
   */
  ngOnInit() {
    this.httpClient.get('/login/company', {withCredentials: true}).subscribe((res: any) => {
      this.company = new Company(res.username, res.name, res.email, res.logo, res.unapprovedChanges);
    });
  }

  /**
   * Check if logged in user is of userGroup `employer`
   */
  isEmployer(): boolean {
    return AuthService.isEmployer();
  }

  /**
   * Attempt to save the new password
   */
  onSavePassword() {
    // Check if the passwords are identical
    if (this.password === this.password2) {

      // Save to Server
      this.httpClient.put('/login/password', {'password': this.password}, {withCredentials: true}).subscribe(
        res => {
          console.log(res);
          this.snackBar.open('Neues Passwort gespeichert!', null, {duration: 5000});
          this.password = '';
          this.password2 = '';
        },
        err => {
          console.log('Error occurred:' + err.error.message);
          this.snackBar.open('Das neue Passwort konnte nicht gespeichert werden! -> '
            + Message.getMessage(err.error.code), null, {duration: 5000});
        }
      );
    } else {
      this.snackBar.open('Passwörter stimmen nicht überein!', null, {duration: 5000});
    }
  }

  /**
   * Attempt to save the changes to the company
   */
  onSaveCompany() {
    // Save to Server
    this.httpClient.put('/login/company', {
      'name': this.company.name,
      'email': this.company.email,
      'logo': this.company.logo
    }, {withCredentials: true}).subscribe((res: any) => {
      this.company.unapprovedChanges = res.unapprovedChanges;
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    } );
  }

  /**
   * Reset the changes to the `company`
   */
  onReset() {
    this.httpClient.put('/login/company/reset', {}, {withCredentials: true}).subscribe((res: any) => {
      this.company = new Company(res.username, res.name, res.email, res.logo, res.unapprovedChanges);
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }

  /**
   * Upload a logo from the users device
   * @param event
   */
  onSelectLogo(event) {
    console.log('changed image');
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      console.log('is image');
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (res: any) => { // called once readAsDataURL is completed
        this.resizeLogoAndSave(res.target.result);
      };
    }
  }

  /**
   * SURPRISE FEATURE
   * Perform a web search with the company name and present a selection of logos to user to choose from
   */
  onFetchLogo() {
    if (this.company.name === '') {
      return;
    }
    this.showProgressBar = true;
    this.httpClient.get('/logo/' + this.company.name).subscribe((res: any) => {
      const images: string[] = [];
      res.map(image => {
        images.push(image);
      });

      const dialogRef = this.dialog.open(SelectLogoComponent, {
        minWidth: '90%',
        minHeight: '90%',
        data: {
          logos: images,
        }
      });

      this.showProgressBar = false;

      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('The dialog was closed');
        if (result != null) {
          this.resizeLogoAndSave(result);
        }
      });
    });
  }

  /**
   * Resize and save the chosen logo
   * @param logo Logo that has been chosen
   */
  resizeLogoAndSave(logo: string) {
    // Create an image element and assign the uploaded image
    const img = new Image();
    img.src = logo;
    img.onload = () => {

      // Get dimensions
      let width = img.width;
      let height = img.height;

      // Define max hight and width
      const MAX_WIDTH = 200;
      const MAX_HEIGHT = 200;

      // Calculate new size
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      // Create Canvas and get context
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Apply new size
      canvas.width = width;
      canvas.height = height;

      // Draw image again, but now with new dimensions
      ctx.drawImage(img, 0, 0, width, height);

      // Get the data from the canvas
      this.company.logo = canvas.toDataURL('image/png');
    };
  }

}
