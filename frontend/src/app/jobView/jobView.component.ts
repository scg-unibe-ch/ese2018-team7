import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Skill} from '../skill';

@Component({
  selector: 'app-job-view',
  templateUrl: './jobView.component.html',
  styleUrls: ['./jobView.component.css']
})
export class JobViewComponent implements OnInit {

  @Input()
  job: Job;
  skill: Skill = new Skill (null, '', null);
  skills: Skill[] = [];
  @Output()
  destroy = new EventEmitter<Job>();

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/skillEdit', {
      params:  new HttpParams().set('jobId', '' + this.job.id)
    }).subscribe((instances: any) => {
      this.skills = instances.map((instance) => new Skill(instance.id, instance.name, instance.jobId));
    });
  }
}
