import {Component, OnInit} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import * as moment from 'moment';

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
  job: Job = new Job(null, '', '', '', moment() , 100, '', '', false);

  // Array of current jobs
  jobs: Job[] = [];

  // Variable for return messages to the user
  msg;


  constructor(private httpClient: HttpClient, private router: Router) {
    // Only accessible for loggedin users
    AuthService.allowOnlyLogin(httpClient, router);
  }

  ngOnInit() {
    // Load all editable jobs from the server
    this.httpClient.get('http://localhost:3000/jobs/editable', {withCredentials: true}).subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>
        new Job(instance.id,
          instance.title,
          instance.company,
          instance.placeofwork,
          moment(instance.startofwork, 'X'),
          instance.workload,
          instance.description,
          instance.contactinfo,
          instance.approved));
      if (this.jobs.length === 0) {
        this.msg = 'Currently you have no editable Jobs!';
      }
    });
  }

  /**
   * Adding a new Job
   */
  onJobCreate() {
    this.httpClient.post('http://localhost:3000/jobs', {
      'title': this.job.title, 'company': this.job.company, 'description': this.job.description,
    }, {withCredentials: true}).subscribe((instance: any) => {
      this.job.id = instance.id;
      this.jobs.push(this.job);
      this.job = new Job(null, '', '', '', moment(), 100, '', '', false);
    });
  }

  /**
   * Removing a Job
   */
  onJobDestroy(job: Job) {
    this.jobs.splice(this.jobs.indexOf(job), 1);
  }

}
