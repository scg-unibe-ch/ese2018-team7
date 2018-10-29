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
        console.log(res.target.result);
        this.company.logo = res.target.result;
      };
    }
  }

}
