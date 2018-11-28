import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Company} from '../company';
import {Message} from '../message';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SelectLogoComponent} from '../selectLogo/selectLogo.component';

@Component({
  selector: 'app-company-edit',
  templateUrl: './accountSettings.component.html',
  styleUrls: ['./accountSettings.component.css']
})
/**
 * Form to change the password of the current user
 */
export class AccountSettingsComponent implements OnInit {

  @Input()
  company: Company;
  msg: String;
  password: String;
  password2: String;
  userMail: String;
  showProgressBar = false;
  @Output()
  destroy = new EventEmitter<User>();


  constructor(private httpClient: HttpClient, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {
    // Only accessible for employer
    AuthService.allowOnlyLogin(httpClient, router);

    this.company = new Company();
  }


  ngOnInit() {
    this.httpClient.get('/login/company', {withCredentials: true}).subscribe((res: any) => {
      this.company = new Company(res.username, res.name, res.email, res.logo, res.unapprovedChanges);
      this.httpClient.get('/login/mail/' + res.username, {withCredentials: true}).subscribe((res2: any) => {
        this.userMail = res.userMail;
      });
    });
  }

  isEmployer() {
    return AuthService.isEmployer();
  }

  isMessage() {
    return this.msg === '';
  }

  messageClass() {
    return (this.msg === 'Neues Passwort gespeichert!' ? 'success' : 'error-text');
  }

  /**
   * Try to save the new password
   */
  onSavePassword() {

    // Check if the passwords are identical
    if (this.password === this.password2) {
      this.msg = '';

      // Save to Server
      this.httpClient.put('/login/password', {'password': this.password}, {withCredentials: true}).subscribe(
        res => {
          console.log(res);
          this.msg = 'Neues Passwort gespeichert!';
          this.password = '';
          this.password2 = '';
        },
        err => {
          console.log('Error occurred:' + err.error.message);
          this.msg = 'Das neue Passwort konnte nicht gespeichert werden! -> ' + Message.getMessage(err.error.code);
        }
      );
    } else {
      this.msg = 'Passwörter stimmen nicht überein!';
    }
  }

  /**
   * Try to save the new company
   */
  onSaveCompany() {

    // Save to Server
    this.httpClient.put('/login/company', {
      'name': this.company.name,
      'email': this.company.email,
      'logo': this.company.logo
    }, {withCredentials: true}).subscribe(res => {
      this.company.unapprovedChanges = true;
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    } );
  }
  onReset() {
    this.httpClient.put('/login/company/reset', {}, {withCredentials: true}).subscribe((res: any) => {
      this.company = new Company(res.username, res.name, res.email, res.logo, res.unapprovedChanges);
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }

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
