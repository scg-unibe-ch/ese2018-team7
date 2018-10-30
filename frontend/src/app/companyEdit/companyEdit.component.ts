import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Company} from '../company';

@Component({
  selector: 'app-company-edit',
  templateUrl: './companyEdit.component.html',
  styleUrls: ['./companyEdit.component.css']
})
/**
 * Form to change the password of the current user
 */
export class CompanyEditComponent implements OnInit {

  @Input()
  company: Company;
  @Output()
  destroy = new EventEmitter<User>();


  constructor(private httpClient: HttpClient, private router: Router) {
    // Only accessible for employer
    AuthService.allowOnlyEmployer(httpClient, router);

    this.company = new Company();
  }


  ngOnInit() {
    this.httpClient.get('/login/company', {withCredentials: true}).subscribe((res: any) => {
      this.company = new Company(res.username, res.name, res.logo, res.unapprovedChanges);
    });
  }

  /**
   * Try to save the new password
   */
  onSave() {

    // Save to Server
    this.httpClient.put('/login/company', {
      'name': this.company.name,
      'logo': this.company.logo
    }, {withCredentials: true}).subscribe(res => {
      this.company.unapprovedChanges = true;
    }  );

  }
  onReset() {
    this.httpClient.put('/login/company/reset', {}, {withCredentials: true}).subscribe((res: any) => {
      this.company = new Company(res.username, res.name, res.logo, res.unapprovedChanges);
    });
  }

  onSelectLogo(event) {
    console.log('changed image');
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      console.log('is image');
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (res: any) => { // called once readAsDataURL is completed

        // Create an image element and assign the uploaded image
        const img = new Image();
        img.src = res.target.result;
        img.onload = () => {

          // Get dimensions
          let width = img.width;
          let height = img.height;

          // Define max hight and width
          const MAX_WIDTH = 400;
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
      };
    }
  }

}
