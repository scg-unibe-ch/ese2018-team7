import {Component, OnInit} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import * as moment from 'moment';
import {Company} from '../company';
import {Message} from '../message';
import {MatSnackBar, PageEvent} from '@angular/material';
import {Salary} from '../salary';

@Component({
  selector: 'app-jobs-edit',
  templateUrl: './jobsEdit.component.html',
  styleUrls: ['./jobsEdit.component.css']
})
/**
 * Component to display all Jobs editable for the current user
 */
export class JobsEditComponent implements OnInit {

  // Object for creating a new Job
  job: Job = new Job();

  // Array of current jobs
  jobs: Job[] = [];

  // Variable for return messages to the user
  msg;

  // Paginator event
  pageEvent: PageEvent;

  // Paginator page size
  pageSize = ((this.getCookie('pageSize') === '') ? 8 : parseInt(this.getCookie('pageSize'), 10));

  constructor(private httpClient: HttpClient, private router: Router, private snackBar: MatSnackBar) {
    // Only accessible for logged-in users
    AuthService.allowOnlyLogin(httpClient, router);
  }

  ngOnInit() {
    // Load all editable jobs from the server
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
          new Company('', instance.companyName, instance.companyLogo),
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
   * Adding a new Job
   */
  onJobCreate() {
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
      this.job.approved = false;
      this.jobs.push(this.job);
      this.job = new Job();
      this.msg = '';
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }

  /**
   * Removing a Job
   */
  onJobDestroy(job: Job) {
    this.jobs.splice(this.jobs.indexOf(job), 1);
    if (this.jobs.length === 0) {
      this.msg = 'Aktuell gibt es keine Jobs zu bearbeiten!';
    }
  }

  allowCreateJob() {
    return AuthService.isEmployer();
  }

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

  setPageSizeCookie(newPageSize) {
    document.cookie = 'pageSize=' + newPageSize;
    console.log('Changed jobs per page to ' + newPageSize);
  }
}
