import {Component, EventEmitter, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatSnackBar, PageEvent} from '@angular/material';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {Job} from '../job';
import * as moment from 'moment';
import {Moment} from 'moment';
import {Company} from '../company';
import {JobsAdvancedSearchComponent} from '../jobsAdvancedSearch/jobsAdvancedSearch.component';
import {Message} from '../message';
import {Salary} from '../salary';

/**
 * Component to display all approved jobs in an aggregated way to the public
 */
@Component({
  selector: 'app-jobs-view',
  templateUrl: './jobsView.component.html',
  styleUrls: ['./jobsView.component.css']
})

export class JobsViewComponent implements OnInit {

  /**
   * Array of all approved jobs
   */
  jobs: Job[] = [];

  /**
   * Variable to return messages to the user
   */
  msg: String = '';

  /**
   * Search query variable for the easy search
   */
  searchParam = '';

  /**
   * Observable to check if user is using a mobile device
   */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  /**
   * Observable to check if user is using a tablet device
   */
  isTablet$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Tablet)
    .pipe(
      map(result => result.matches)
    );

  /**
   * Observable to check if user is using a desktop device
   */
  isWeb$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Web)
    .pipe(
      map(result => result.matches)
    );

  /**
   * Advanced search variable for title
   */
  advSearchTitle = '';

  /**
   * Advanced search variable for company
   */
  advSearchCompany = '';

  /**
   * Advanced search variable for department
   */
  advSearchDepartment = '';

  /**
   * Advanced search variable for start of work after a specific time point
   */
  advSearchStartAfter: Moment =  moment().subtract(1, 'w');

  /**
   * Advanced search variable for start of work before a specific time point
   */
  advSearchStartBefore: Moment = moment().add(1, 'y');

  /**
   * Advanced search variable for workload greater than a specific percentage
   */
  advSearchWorkLoadGt = 0;

  /**
   * Advanced search variable for workload lower than a specific percentage
   */
  advSearchWorkLoadLt = 100;

  /**
   * Simple EventEmitter to refresh the advanced search
   */
  advSearchRangeRefresh: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Flag to indicate if a search is active or not
   */
  searched = false;

  /**
   * PageEvent for the paginator
   */
  pageEvent: PageEvent;

  /**
   * Page size that was chosen by the user for the pagination
   */
  pageSize = ((this.getCookie('pageSize') === '') ? 8 : parseInt(this.getCookie('pageSize'), 10));

  /**
   * Sorting that was chosen by the user for the jobs
   */
  sorting = 'titleASC';

  /**
   * @ignore
   */
  constructor(private httpClient: HttpClient, private dialog: MatDialog, private breakpointObserver: BreakpointObserver,
              private snackBar: MatSnackBar) {
  }

  /**
   * Initialise this component by loading all jobs from the server
   */
  ngOnInit() {
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
          new Salary().fromString(instance.salary),
          instance.shortDescription,
          instance.description,
          JSON.parse(instance.skills),
          instance.phone,
          instance.email,
          instance.website,
          instance.contactInfo,
          new Company('', instance.companyName, '', instance.companyLogo)));

      if (this.jobs.length === 0) {
        this.msg = 'Aktuell sind keine Jobs verfügbar!';
        console.log('No jobs available');
      } else {
        this.msg = '';
      }
      this.advSearchRangeRefresh.emit();
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });

    this.pageEvent = new PageEvent();
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.pageIndex = 0;
    this.pageEvent.length = this.jobs.length;
  }

  /**
   * Load jobs from the server that match the easy search query
   */
  onEasySearch() {
    this.httpClient.get('/jobs/?easy=' + this.searchParam).subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>
        new Job(instance.id,
          instance.title,
          instance.department,
          instance.placeOfWork,
          instance.contractType,
          moment(instance.startOfWork, 'X'),
          moment(instance.endOfWork, 'X'),
          instance.workload,
          new Salary().fromString(instance.salary),
          instance.shortDescription,
          instance.description,
          JSON.parse(instance.skills),
          instance.phone,
          instance.email,
          instance.website,
          instance.contactInfo,
          new Company('', instance.companyName, '', instance.companyLogo)));

      if (this.jobs.length === 0) {
        this.msg = 'Zu dieser Suche wurden keine Jobs gefunden!';
      } else {
        this.msg = '';
      }
      this.searched = true;
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }

  /**
   * Load all jobs from the server that match the advanced search
   */
  onAdvancedSearch() {
    this.httpClient.get('/jobs/?' +
      'title=' + this.advSearchTitle + '&' +
      'company=' + this.advSearchCompany + '&' +
      'department=' + this.advSearchDepartment + '&' +
      'startAfter=' + (this.advSearchStartAfter.startOf('day').unix() !== moment().subtract(1, 'w')
        .startOf('day').unix() ? this.advSearchStartAfter.unix() : 0) + '&' +
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
          new Salary().fromString(instance.salary),
          instance.shortDescription,
          instance.description,
          JSON.parse(instance.skills),
          instance.phone,
          instance.email,
          instance.website,
          instance.contactInfo,
          new Company('', instance.companyName, '', instance.companyLogo),
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
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }

  /**
   * Reset a search that has been performed
   */
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
          new Salary().fromString(instance.salary),
          instance.shortDescription,
          instance.description,
          JSON.parse(instance.skills),
          instance.phone,
          instance.email,
          instance.website,
          instance.contactInfo,
          new Company('', instance.companyName, '', instance.companyLogo),
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
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }

  /**
   * Open the dialog window which contains the advanced search options
   */
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

  /**
   * Get content of cookie with the specified name
   *
   * Returns an empty string if no cookie exists with this name
   * @param cname Name of the cookie that should be retrieved
   * @returns Content of the specified cookie
   */
  getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  /**
   * Save the pageSize that was chosen by the user in a cookie
   * @param newPageSize PageSize that should be saved
   */
  setPageSizeCookie(newPageSize) {
     document.cookie = 'pageSize=' + newPageSize;
     console.log('Changed jobs per page to ' + newPageSize);
  }
}
