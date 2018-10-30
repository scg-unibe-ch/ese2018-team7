import {Component, OnInit} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import * as moment from 'moment';
import {Company} from '../company';

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

  constructor(private httpClient: HttpClient, private router: Router) {
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
          instance.department,
          instance.placeOfWork,
          instance.contractType,
          moment(instance.startOfWork, 'X'),
          instance.workload,
          instance.description,
          JSON.parse(instance.skills),
          instance.phone,
          instance.email,
          instance.contactInfo,
          new Company('', instance.companyName, instance.companyLogo),
          moment(instance.startOfPublication, 'X'),
          moment(instance.endOfPublication, 'X'),
          instance.approved,
          instance.changed != null && instance.changed));
      if (this.jobs.length === 0) {
        this.msg = 'Aktuell gibt es keine Jobs zu bearbeiten!';
      }
    });
  }

  /**
   * Adding a new Job
   */
  onJobCreate() {
    this.httpClient.post('/jobs', {
      'title': this.job.title,
      'startOfWork': this.job.startOfWork.unix(),
      'workload': this.job.workload,
      'skills': JSON.stringify(this.job.skills),
      'startOfPublication': this.job.startOfPublication.unix(),
      'endOfPublication': this.job.endOfPublication.unix()
    }, {withCredentials: true}).subscribe((instance: any) => {
      this.job.id = instance.id;
      this.jobs.push(this.job);
      this.job = new Job();
      this.msg = '';
    });
  }

  /**
   * Removing a Job
   */
  onJobDestroy(job: Job) {
    this.jobs.splice(this.jobs.indexOf(job), 1);
  }

  allowCreateJob() {
    return AuthService.isEmployer();
  }
}
