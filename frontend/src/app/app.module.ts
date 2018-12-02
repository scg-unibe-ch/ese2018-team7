import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LayoutModule} from '@angular/cdk/layout';
import {CdkTableModule} from '@angular/cdk/table';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {FormsModule} from '@angular/forms';
// 3rd party imports
import {AutosizeModule} from 'ngx-autosize';
import {MarkdownModule} from 'ngx-markdown';
import {AngularMarkdownEditorModule} from 'angular-markdown-editor';
import {Ng5SliderModule} from 'ng5-slider';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDatepickerModule, MatMomentDateModule} from '@coachcare/datepicker';
import {MAT_MOMENT_DATE_FORMATS} from './customCHLocale/moment-date-formats';
// Import css components from angular material
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorIntl,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
// Import all Components
import {AppComponent} from './app.component';
import {JobEditComponent} from './jobEdit/jobEdit.component';
import {JobsEditComponent} from './jobsEdit/jobsEdit.component';
import {JobViewComponent} from './jobView/jobView.component';
import {JobsViewComponent} from './jobsView/jobsView.component';
import {SkillEditComponent} from './skillEdit/skillEdit.component';
import {SkillViewComponent} from './skillView/skillView.component';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AppRoutingModule} from './app-routing.module';
import {LogoutComponent} from './logout/logout.component';
import {UsersEditComponent} from './usersEdit/usersEdit.component';
import {AccountSettingsComponent} from './accountSettings/accountSettings.component';
import {JobViewDetailsComponent} from './jobViewDetails/jobViewDetails.component';
import {JobsAdvancedSearchComponent} from './jobsAdvancedSearch/jobsAdvancedSearch.component';
import {APIInterceptor} from './apiInterceptor/apiInterceptor';
import {ConfirmDialogComponent} from './confirmDialog/confirmDialog.component';
import {JobsPaginatorPipe} from './jobsView/jobsPaginator.pipe';
import {CustomMatPaginatorIntl} from './customCHLocale/CustomMatPaginatorIntl';
import {JobsSortPipe} from './jobsView/jobsSort.pipe';
import {SelectLogoComponent} from './selectLogo/selectLogo.component';
import {JobsEditSortPipe} from './jobsEdit/jobsEditSort.pipe';

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
    UsersEditComponent,
    AccountSettingsComponent,
    ConfirmDialogComponent,
    JobsPaginatorPipe,
    JobsSortPipe,
    SelectLogoComponent,
    JobsEditSortPipe,
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
    MatProgressBarModule,
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
    MatSelectModule,
    MarkdownModule.forRoot(),
    AngularMarkdownEditorModule.forRoot(),
    MatSlideToggleModule,
  ],
  entryComponents: [
    JobViewDetailsComponent,
    JobViewComponent,
    JobsAdvancedSearchComponent,
    ConfirmDialogComponent,
    SelectLogoComponent,
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_LOCALE, useValue: 'de-CH' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    { provide: HTTP_INTERCEPTORS,  useClass: APIInterceptor, multi: true },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
    ],
   bootstrap: [AppComponent]
})

export class AppModule {
}
