import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

// Add css components from angular material
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatInputModule,
  MatListModule,
  MatSliderModule,
  MatDatepickerModule, MAT_DATE_LOCALE,
} from '@angular/material';

import {FormsModule} from '@angular/forms';
import {AutosizeModule} from 'ngx-autosize';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule} from '@angular/material-moment-adapter';

// Import all Components
import {JobEditComponent} from './jobEdit/jobEdit.component';
import {JobsEditComponent} from './jobsEdit/jobsEdit.component';
import {JobViewComponent} from './jobView/jobView.component';
import {JobsViewComponent} from './jobsView/jobsView.component';
import {SkillEditComponent} from './skillEdit/skillEdit.component';
import {SkillViewComponent} from './skillView/skillView.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {AppRoutingModule } from './app-routing.module';
import {LogoutComponent} from './logout/logout.component';
import {ChangePasswordComponent} from './changePassword/changePassword.component';
import {UsersEditComponent} from './usersEdit/usersEdit.component';

@NgModule({
  declarations: [
    AppComponent,
    JobViewComponent,
    JobsViewComponent,
    JobEditComponent,
    JobsEditComponent,
    SkillViewComponent,
    SkillEditComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    PageNotFoundComponent,
    ChangePasswordComponent,
    UsersEditComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatSliderModule,
    MatDatepickerModule,
    MatListModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    AutosizeModule,
    AppRoutingModule,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {provide: MAT_DATE_LOCALE, useValue: 'de-CH'}
    ],
   bootstrap: [AppComponent]
})
export class AppModule {
}
