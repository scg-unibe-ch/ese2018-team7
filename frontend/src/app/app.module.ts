import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

// Add css components from angular material
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatInputModule,
  MatListModule,
  MatSliderModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatRadioModule,
  MatExpansionModule,
  MatStepperModule,
  MatGridListModule,
  MatSnackBarModule,
  MatBadgeModule,
} from '@angular/material';

import { LayoutModule } from '@angular/cdk/layout';
import { CdkTableModule} from '@angular/cdk/table';

import {AutosizeModule} from 'ngx-autosize';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { Ng5SliderModule } from 'ng5-slider';
import {MatDatepickerModule, MatMomentDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS} from '@coachcare/datepicker';
import { MAT_MOMENT_DATE_FORMATS } from './customCHLocale/moment-date-formats';
import {FormsModule, Validators} from '@angular/forms';
// Import all Components
import {JobEditComponent} from './jobEdit/jobEdit.component';
import {JobsEditComponent} from './jobsEdit/jobsEdit.component';
import {JobViewComponent} from './jobView/jobView.component';
import {JobsViewComponent} from './jobsView/jobsView.component';
import {SkillEditComponent} from './skillEdit/skillEdit.component';
import {SkillViewComponent} from './skillView/skillView.component';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {AppRoutingModule } from './app-routing.module';
import {LogoutComponent} from './logout/logout.component';
import {ChangePasswordComponent} from './changePassword/changePassword.component';
import {UsersEditComponent} from './usersEdit/usersEdit.component';
import {AccountSettingsComponent} from './accountSettings/accountSettings.component';
import {JobViewDetailsComponent} from './jobViewDetails/jobViewDetails.component';
import {JobsAdvancedSearchComponent} from './jobsAdvancedSearch/jobsAdvancedSearch.component';
import {APIInterceptor} from './apiInterceptor/apiInterceptor';
import {ConfirmDialogComponent} from './confirmDialog/confirmDialog.component';

@NgModule({
  declarations: [
    AppComponent,
    JobViewComponent,
    JobViewDetailsComponent,
    JobsViewComponent,
    JobsAdvancedSearchComponent,
    JobEditComponent,
    JobsEditComponent,
    SkillViewComponent,
    SkillEditComponent,
    LoginComponent,
    LogoutComponent,
    RegistrationComponent,
    PageNotFoundComponent,
    ChangePasswordComponent,
    UsersEditComponent,
    AccountSettingsComponent,
    ConfirmDialogComponent,
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
    Ng5SliderModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatRadioModule,
    MatExpansionModule,
    MatStepperModule,
    MatGridListModule,
    MatBadgeModule,
    CdkTableModule,
    MatSnackBarModule,
  ],
  entryComponents: [
    JobViewDetailsComponent,
    JobViewComponent,
    JobsAdvancedSearchComponent,
    ConfirmDialogComponent,
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_LOCALE, useValue: 'de-CH' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    { provide: HTTP_INTERCEPTORS,  useClass: APIInterceptor, multi: true }
    ],
   bootstrap: [AppComponent]
})
export class AppModule {
}
