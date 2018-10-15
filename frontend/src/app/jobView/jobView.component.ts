import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Skill} from '../skill';

@Component({
  selector: 'app-job-view',
  templateUrl: './jobView.component.html',
  styleUrls: ['./jobView.component.css']
})
/**
 * Component to display one Job
 */
export class JobViewComponent implements OnInit {

  // The Job
  @Input()
  job: Job;
  formattedstartofwork: string;

  // The required Skills
  skills: Skill[] = [];

  @Output()
  destroy = new EventEmitter<Job>();

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.formattedstartofwork = this.job.startofwork.format('YYYY-MM-DD');
    // Load the Skills from the Server
    this.httpClient.get('http://localhost:3000/skills', {
      params:  new HttpParams().set('jobId', '' + this.job.id)
    }).subscribe((instances: any) => {
      this.skills = instances.map((instance) => new Skill(instance.id, instance.name, instance.jobId));
    });
  }
}
