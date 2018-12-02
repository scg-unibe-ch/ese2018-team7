import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';

import {User} from '../user';
import {AuthService} from '../auth/auth.service';
import {Company} from '../company';
import {Usergroup} from '../usergroup';
import {Message} from '../message';
import {SelectLogoComponent} from '../selectLogo/selectLogo.component';

/**
 * Component where employers can register for a new user account
 */
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {

  /**
   * Flag to indicate if loading bar should be shown
   */
  showProgressBar = false;

  /**
   * New `user` that is created during registration
   */
  user: User;

  /**
   * New `company` that is created during registration
   */
  company: Company;

  /**
   * Simple EventEmitter to destroy this component
   */
  @Output()
  destroy = new EventEmitter<User>();

  /**
   * Creates a new instance of this component with the given parameters
   * and makes sure it is only accessible to public users
   * @param httpClient
   * @param router
   * @param snackBar SnackBar to display messages to the user
   * @param dialog Dialog to present a selection of logos to the user
   */
  constructor(private httpClient: HttpClient, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {
    AuthService.allowOnlyPublic(httpClient, router);
  }

  /**
   * Initialise this component with a new empty `user` and `company`
   */
  ngOnInit() {
    // Set 'empty' User
    this.user = new User('', '', Usergroup.employer, false);
    this.company = new Company('', '', '', '');
  }

  /**
   * Attempt to register a new user on the server with the given credentials
   * and do form validation in advance
   */
  onCreate() {
    this.company.username = this.user.username;

    if (this.company.name === '' || this.user.username === '' || this.user.password === '' || this.company.email === '' ||
      !this.company.email.match('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$')) {
      this.snackBar.open('Formular nicht vollständig ausgefüllt!', null, {duration: 5000});
      return;
    }
    if (this.company.logo === '') {
      this.snackBar.open('Kein Unternehmenslogo ausgewählt!', null, {duration: 5000});
      return;
    }

    this.httpClient.post('/login/', {
      'username': this.user.username, 'password': this.user.password, 'email': this.company.email, 'type': Usergroup.employer,
      'enabled': 'false', 'company': this.company.name, 'logo': this.company.logo
    }, {withCredentials: true}).subscribe((res: any) => {
        console.log(res);
        this.snackBar.open(Message.getMessage(res.code), null, {duration: 5000});
        this.router.navigate(['/']);
      },
      (err: any) => {
        console.error(err.error.message);
        this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
      });
  }

  /**
   * Allow the user to upload a logo from his own computer and save it in the company
   * @param event
   */
  onSelectLogo(event) {
    console.log('changed image');
    if (event.target.files && event.target.files[0]) {
      this.showProgressBar = true;
      const reader = new FileReader();
      console.log('is image');
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (res: any) => { // called once readAsDataURL is completed
        this.resizeLogoAndSave(res.target.result);
      };
    }
  }

  /**
   * Generate a simple logo with the name of the company and random complementary colors
   */
  onGenerateLogo() {
    if (this.company.name === '') {
      this.snackBar.open('Zuerst Unternehmensname eingeben!', null, {duration: 5000});
      return;
    }

    // create canvas element
    const canvas = document.createElement('canvas');
    const height = 200;
    const width = 400;
    canvas.height = height;
    canvas.width = width;

    // Get the context to allow manipulating the image
    const context = canvas.getContext('2d');

    // Fill background with random color
    context.fillStyle = 'rgba(' + Math.random() * 256 + ',' + Math.random() * 256 + ',' + Math.random() * 256 + ')';
    context.fillRect(0, 0, width, height);

    // Write text in complementary color
    context.globalCompositeOperation = 'difference';
    context.fillStyle = 'white';
    context.font = 500 / this.company.name.length + 'px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(this.company.name, 200, 100);

    // Save Image
    this.resizeLogoAndSave(canvas.toDataURL('image/png'));
  }

  /**
   * Fetch a selection of logos from the web via server request,
   * the user can then choose one and it will be saved in the company.
   */
  onFetchLogo() {
    if (this.company.name === '') {
      this.snackBar.open('Zuerst Unternehmensnamen eingeben!', null, {duration: 5000});
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
   * Resize and save the logo passed as parameter
   * @param logo Chosen logo as base64 encoded string
   */
  resizeLogoAndSave(logo: string) {
    // Create an image element and assign the uploaded image
    const img = new Image();
    img.src = logo;
    img.onload = () => {

      // Get dimensions
      let width = img.width;
      let height = img.height;

      // Define max height and width
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
      this.showProgressBar = false;
    };
  }
}
