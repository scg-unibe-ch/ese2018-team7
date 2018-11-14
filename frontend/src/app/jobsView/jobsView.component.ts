import {Component, EventEmitter, OnInit} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import {Moment} from 'moment';
import {Company} from '../company';
import {JobViewDetailsComponent} from '../jobViewDetails/jobViewDetails.component';
import {MatDialog, MatPaginator, MatSnackBar, PageEvent} from '@angular/material';
import {JobsAdvancedSearchComponent} from '../jobsAdvancedSearch/jobsAdvancedSearch.component';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {Message} from '../message';

@Component({
  selector: 'app-jobs-view',
  templateUrl: './jobsView.component.html',
  styleUrls: ['./jobsView.component.css']
})

/**
 * Component to display all approved Jobs
 */
export class JobsViewComponent implements OnInit {

  // Array of all approved Jobs
  jobs: Job[] = [];

  // Variable to return values to the user
  msg: String = '';

  // Easy Search query variable
  searchParam = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  isTablet$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Tablet)
    .pipe(
      map(result => result.matches)
    );

  isWeb$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Web)
    .pipe(
      map(result => result.matches)
    );

  // Advanced Search variables
  advSearchTitle = '';
  advSearchCompany = '';
  advSearchDepartment = '';
  advSearchStartAfter: Moment =  moment().subtract(1, 'w');
  advSearchStartBefore: Moment = moment().add(1, 'y');
  advSearchWorkLoadGt = 0;
  advSearchWorkLoadLt = 100;

  // To manually refresh range bar -> needed...
  advSearchRangeRefresh: EventEmitter<void> = new EventEmitter<void>();

  searched = false;

  pageEvent: PageEvent;
  sorting = 'titleASC';

  constructor(private httpClient: HttpClient, private dialog: MatDialog, private breakpointObserver: BreakpointObserver,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {

    // Load the Jobs from the Server
    this.httpClient.get('/jobs').subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>
        new Job(instance.id,
          instance.title,
          instance.department,
          instance.placeOfWork,
          instance.contractType,
          moment(instance.startOfWork, 'X'),
          moment(instance.endOfWork, 'X'),
          instance.workload,
          instance.shortDescription,
          instance.description,
          JSON.parse(instance.skills),
          instance.phone,
          instance.email,
          instance.website,
          instance.contactInfo,
          new Company('', instance.companyName, instance.companyLogo)));

      if (this.jobs.length === 0) {
        this.msg = 'Aktuell sind keine Jobs verfügbar!';
        console.log('No jobs available');
      } else {
        this.msg = '';
      }
      this.advSearchRangeRefresh.emit();


    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 3000});
    });

    this.pageEvent = new PageEvent();
    this.pageEvent.pageSize = 10;
    this.pageEvent.pageIndex = 0;
    this.pageEvent.length = this.jobs.length;

  }

  onEasySearch() {

    // Load the Jobs from the Server
    this.httpClient.get('/jobs/?title=' + this.searchParam).subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>
        new Job(instance.id,
          instance.title,
          instance.department,
          instance.placeOfWork,
          instance.contractType,
          moment(instance.startOfWork, 'X'),
          moment(instance.endOfWork, 'X'),
          instance.workload,
          instance.shortDescription,
          instance.description,
          JSON.parse(instance.skills),
          instance.phone,
          instance.email,
          instance.website,
          instance.contactInfo,
          new Company('', instance.companyName, instance.companyLogo)));

      if (this.jobs.length === 0) {
        this.msg = 'Zu dieser Suche wurden keine Jobs gefunden!';
      } else {
        this.msg = '';
      }
      this.searched = true;
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 3000});
    });
  }
  onAdvancedSearch() {

    // Load the Jobs from the Server
    this.httpClient.get('/jobs/?' +
      'title=' + this.advSearchTitle + '&' +
      'company=' + this.advSearchCompany + '&' +
      'department=' + this.advSearchDepartment + '&' +
      'startAfter=' + this.advSearchStartAfter.unix() + '&' +
      'startBefore=' + this.advSearchStartBefore.unix() + '&' +
      'workloadGt=' + this.advSearchWorkLoadGt + '&' +
      'workloadLt=' + this.advSearchWorkLoadLt
    ).subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>
        new Job(instance.id,
          instance.title,
          instance.department,
          instance.placeOfWork,
          instance.contractType,
          moment(instance.startOfWork, 'X'),
          moment(instance.endOfWork, 'X'),
          instance.workload,
          instance.shortDescription,
          instance.description,
          JSON.parse(instance.skills),
          instance.phone,
          instance.email,
          instance.website,
          instance.contactInfo,
          new Company('', instance.companyName, instance.companyLogo),
          moment(instance.startOfPublication, 'X'),
          moment(instance.endOfPublication, 'X')));

      if (this.jobs.length === 0) {
        this.msg = 'Zu dieser Suche wurden keine Jobs gefunden!';
      } else {
        this.msg = '';
      }
      this.searched = true;
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 3000});
    });
  }
  resetSearch() {
    this.searchParam = '';
    this.advSearchTitle = '';
    this.advSearchCompany = '';
    this.advSearchDepartment = '';
    this.advSearchStartAfter =  moment().subtract(1, 'w');
    this.advSearchStartBefore = moment().add(1, 'y');
    this.advSearchWorkLoadGt = 0;
    this.advSearchWorkLoadLt = 100;
    this.searched = false;
    this.httpClient.get('/jobs').subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>
        new Job(instance.id,
          instance.title,
          instance.department,
          instance.placeOfWork,
          instance.contractType,
          moment(instance.startOfWork, 'X'),
          moment(instance.endOfWork, 'X'),
          instance.workload,
          instance.shortDescription,
          instance.description,
          JSON.parse(instance.skills),
          instance.phone,
          instance.email,
          instance.website,
          instance.contactInfo,
          new Company('', instance.companyName, instance.companyLogo),
          moment(instance.startOfPublication, 'X'),
          moment(instance.endOfPublication, 'X')));

      if (this.jobs.length === 0) {
        this.msg = 'Aktuell sind keine Jobs verfügbar!';
      } else {
        this.msg = '';
      }
      this.advSearchRangeRefresh.emit();
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 3000});
    });
  }
  openAdvancedSearch (): void {
    const dialogRef = this.dialog.open(JobsAdvancedSearchComponent, {
      minWidth: '90%',
      minHeight: '90%',
      data: {
        advSearchTitle: this.advSearchTitle,
        advSearchCompany: this.advSearchCompany,
        advSearchDepartment: this.advSearchDepartment,
        advSearchStartAfter: this.advSearchStartAfter,
        advSearchStartBefore: this.advSearchStartBefore,
        advSearchWorkLoadGt: this.advSearchWorkLoadGt,
        advSearchWorkLoadLt: this.advSearchWorkLoadLt,
        doSearch: false,
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
      if (result != null) {
        this.advSearchTitle = result.advSearchTitle;
        this.advSearchCompany = result.advSearchCompany;
        this.advSearchDepartment = result.advSearchDepartment;
        this.advSearchStartAfter = result.advSearchStartAfter;
        this.advSearchStartBefore = result.advSearchStartBefore;
        this.advSearchWorkLoadGt = result.advSearchWorkLoadGt;
        this.advSearchWorkLoadLt = result.advSearchWorkLoadLt;
        if (result.doSearch) {
          this.onAdvancedSearch();
        }
      }
    });
  }
}
