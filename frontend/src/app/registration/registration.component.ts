import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {Company} from '../company';

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

  user: User;
  company: Company;
  @Output()
  destroy = new EventEmitter<User>();

  constructor(private httpClient: HttpClient, private router: Router) {
    AuthService.allowOnlyPublic(httpClient, router);
  }

  ngOnInit() {
    // Set 'empty' User
    this.user = new User( '', '', 1 , false);
    this.company = new Company('', '', '');
  }

  /**
   * If the user wants to register with the given credentials
   */
  onCreate() {
    this.company.username = this.user.username;
    this.httpClient.post('http://localhost:3000/login/', {
      'username': this.user.username, 'password': this.user.password, 'type': '1',
      'enabled': 'false', 'company': this.company.name, 'logo': this.company.logo
    }, {withCredentials: true}).subscribe((res: any) => {
        console.log(res);
        if (res.message != null) {
          alert(res.message);
        }
        this.router.navigate(['/']);
      },
      (err: any) => {
        console.error(err);
        this.errorMessage = err.error.errorMessage;
        if (err.error.message != null) {
          alert(err.error.message);
        }
      });
  }
  onSelectLogo(event) {
    console.log('changed image');
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      console.log('is image');
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (res: any) => { // called once readAsDataURL is completed
        console.log(res.target.result);
        this.company.logo = res.target.result;
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
    this.company.logo = canvas.toDataURL('image/png');

  }

}
