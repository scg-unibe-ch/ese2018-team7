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
    // Only accessible for loggedin users
    AuthService.allowOnlyLogin(httpClient, router);
  }

  ngOnInit() {
    // Load all editable jobs from the server
    this.httpClient.get('http://localhost:3000/jobs/editable', {withCredentials: true}).subscribe((instances: any) => {

      console.log(instances);
      this.jobs = instances.map((instance) =>
        new Job(instance.id,
          instance.title,
          instance.departement,
          instance.placeofwork,
          moment(instance.startofwork, 'X'),
          instance.workload,
          instance.description,
          JSON.parse(instance.skills),
          instance.phone,
          instance.email,
          instance.contactinfo,
          new Company('', instance.companyName, instance.companyLogo),
          moment(instance.startofpublication, 'X'),
          moment(instance.endofpublication, 'X'),
          instance.approved,
          instance.changed != null && instance.changed));
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
      'title': this.job.title,
      'startofwork': this.job.startofwork.unix(),
      'workload': this.job.workload,
      'skills': JSON.stringify(this.job.skills),
      'startofpublication': this.job.startofpublication.unix(),
      'endofpublication': this.job.endofpublication.unix()
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

}
