import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {Company} from '../company';
import {Usergroup} from '../usergroup';
import {Message} from '../message';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SelectLogoComponent} from '../selectLogo/selectLogo.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

/**
 * Component to register employer
 */
export class RegistrationComponent implements OnInit {

  errorMessage;
  showProgressBar = false;

  user: User;
  company: Company;
  @Output()
  destroy = new EventEmitter<User>();

  constructor(private httpClient: HttpClient, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {
    AuthService.allowOnlyPublic(httpClient, router);
  }

  ngOnInit() {
    // Set 'empty' User
    this.user = new User('', '', 1, false);
    this.company = new Company('', '', '');
  }

  /**
   * If the user wants to register with the given credentials
   */
  onCreate() {
    this.company.username = this.user.username;
    this.httpClient.post('/login/', {
      'username': this.user.username, 'password': this.user.password, 'type': Usergroup.employer,
      'enabled': 'false', 'company': this.company.name, 'logo': this.company.logo
    }, {withCredentials: true}).subscribe((res: any) => {
        console.log(res);
        this.snackBar.open(Message.getMessage(res.code), null, {duration: 5000});
        this.router.navigate(['/']);
      },
      (err: any) => {
        console.error(err.error.message);
        this.errorMessage = Message.getMessage(err.error.code);
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

  onGenerateLogo() {
    // create canvas element
    const canvas = document.createElement('canvas');
    const height = 200;
    const width = 400;

    canvas.height = height;
    canvas.width = width;

    // get the context to allow manipulating the image
    const context = canvas.getContext('2d');

    // Fill background with white
    context.fillStyle = 'rgba(' + Math.random() * 256 + ',' + Math.random() * 256 + ',' + Math.random() * 256 + ')';
    context.fillRect(0, 0, width, height);

    // Write black text
    context.globalCompositeOperation = 'difference';
    context.fillStyle = 'white';
    context.font = 500 / this.company.name.length + 'px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(this.company.name, 200, 100);

    // Save Image
    this.resizeLogoAndSave(canvas.toDataURL('image/png'));

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
      const MAX_WIDTH = 400;
      const MAX_HEIGHT = 400;

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
