import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {AutosizeModule} from 'ngx-autosize';

// Add css components from angular material
import {MatButtonModule, MatCardModule, MatCheckboxModule, MatInputModule, MatListModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    AutosizeModule,
    AppRoutingModule
  ],
  providers: [],
   bootstrap: [AppComponent]
})
export class AppModule {
}
