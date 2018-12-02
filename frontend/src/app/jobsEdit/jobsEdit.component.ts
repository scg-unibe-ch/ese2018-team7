import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatSnackBar, PageEvent} from '@angular/material';

import {AuthService} from '../auth/auth.service';
import * as moment from 'moment';
import {Job} from '../job';
import {Company} from '../company';
import {Message} from '../message';
import {Salary} from '../salary';

/**
 * Component to display all jobs that are editable for the current user
 *
 * Serves as a wrapper for the [JobEditComponent]{@link JobEditComponent.html}
 */
@Component({
  selector: 'app-jobs-edit',
  templateUrl: './jobsEdit.component.html',
  styleUrls: ['./jobsEdit.component.css']
})

export class JobsEditComponent implements OnInit {

  /**
   * Object for creating a new job
   */
  job: Job = new Job();

  /**
   * Array of all current jobs
   */
  jobs: Job[] = [];

  /**
   * Variable to return messages to the user
   */
  msg: string;

  /**
   * Paginator event
   */
  pageEvent: PageEvent;

  /**
   * Paginator page size, stored in cookie
   */
  pageSize = ((this.getCookie('pageSize') === '') ? 8 : parseInt(this.getCookie('pageSize'), 10));

  /**
   * Sorting of jobs for the paginator
   */
  sorting: string;

  /**
   * Creates a new instance of this component with the provided parameters
   * @param httpClient
   * @param router
   * @param snackBar SnackBar to present messages to the user
   */
  constructor(private httpClient: HttpClient, private router: Router, private snackBar: MatSnackBar) {
    // Only accessible for logged-in users
    AuthService.allowOnlyLogin(httpClient, router);
    this.sorting = this.isModOrAdmin() ? 'todo' : 'titleASC';
  }

  /**
   * Initialise this component by loading all editable jobs from the server
   */
  ngOnInit() {
    this.httpClient.get('/jobs/editable', {withCredentials: true}).subscribe((instances: any) => {
      console.log(instances);
      this.jobs = instances.map((instance) =>
        new Job(instance.id,
          instance.title,
          instance.department == null ? '' : instance.department,
          instance.placeOfWork == null ? '' : instance.placeOfWork,
          instance.contractType == null ? 'unlimited' : instance.contractType,
          moment(instance.startOfWork, 'X'),
          moment(instance.endOfWork, 'X'),
          instance.workload,
          new Salary().fromString(JSON.parse(instance.salary)),
          instance.shortDescription == null ? '' : instance.shortDescription,
          instance.description == null ? '' : instance.description,
          JSON.parse(instance.skills),
          instance.phone == null ? '' : instance.phone,
          instance.email == null ? '' : instance.email,
          instance.website == null ? '' : instance.website,
          instance.contactInfo == null ? '' : instance.contactInfo,
          new Company('', instance.companyName, '', instance.companyLogo),
          moment(instance.startOfPublication, 'X'),
          moment(instance.endOfPublication, 'X'),
          instance.approved,
          instance.changed != null && instance.changed));
      if (this.jobs.length === 0) {
        this.msg = 'Aktuell gibt es keine Jobs zu bearbeiten!';
      }
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
   * Add a new job
   */
  onJobCreate() {
    if (this.job.title === '') {
      this.snackBar.open('Keinen Jobtitel eingegeben!', null, {duration: 5000});
    } else {
      this.httpClient.post('/jobs', {
        'title': this.job.title,
        'startOfWork': this.job.startOfWork.startOf('day').unix(),
        'endOfWork': this.job.endOfWork.endOf('day').unix(),
        'workload': this.job.workload,
        'skills': JSON.stringify(this.job.skills),
        'startOfPublication': this.job.startOfPublication.unix(),
        'endOfPublication': this.job.endOfPublication.unix()
      }, {withCredentials: true}).subscribe((instance: any) => {
        this.job.id = instance.id;
        this.job.email = instance.email;
        this.job.approved = instance.approved;
        this.job.company = new Company('', instance.companyName, instance.companyLogo);
        this.jobs.push(this.job);
        this.job = new Job();
        this.msg = '';
      }, err => {
        console.error(err.error.message);
        this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
      });
    }
  }

  /**
   * Remove the specified job
   * @param job Job that should be removed
   */
  onJobDestroy(job: Job) {
    this.jobs.splice(this.jobs.indexOf(job), 1);
    if (this.jobs.length === 0) {
      this.msg = 'Aktuell gibt es keine Jobs zu bearbeiten!';
    }
  }

  /**
   * Check if the logged in user is allowed to create a new job
   */
  allowCreateJob() {
    return AuthService.isEmployer();
  }

  /**
   * Check if the logged in user is administrator or moderator
   */
  isModOrAdmin() {
    return AuthService.isModOrAdmin();
  }

  /**
   * Get content of cookie with the specified name
   *
   * Returns an empty string if no cookie exists with this name
   * @param cname Name of the cookie that should be retrieved
   * @returns Content of the specified cookie
   */
  getCookie(cname): string {
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
