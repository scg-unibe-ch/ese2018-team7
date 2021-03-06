import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {RegistrationComponent} from './registration/registration.component';
import {LoginComponent} from './login/login.component';
import {JobsEditComponent} from './jobsEdit/jobsEdit.component';
import {JobsViewComponent} from './jobsView/jobsView.component';
import {LogoutComponent} from './logout/logout.component';
import {UsersEditComponent} from './usersEdit/usersEdit.component';
import {AccountSettingsComponent} from './accountSettings/accountSettings.component';

const appRoutes: Routes = [
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent},
  { path: 'editJobs', component: JobsEditComponent },
  { path: 'viewJobs', component: JobsViewComponent },
  { path: 'editUsers', component: UsersEditComponent},
  { path: 'editAccount', component: AccountSettingsComponent},
  { path: '', redirectTo: '/viewJobs', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
