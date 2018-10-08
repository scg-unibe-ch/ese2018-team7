import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Skill} from '../skill';
import {Router} from '@angular/router';

@Component({
  selector: 'app-job-edit',
  templateUrl: './jobEdit.component.html',
  styleUrls: ['./jobEdit.component.css']
})
export class JobEditComponent implements OnInit {

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
      params:  new HttpParams().set('jobId', '' + this.job.id), withCredentials: true
    }).subscribe((instances: any) => {
      this.skills = instances.map((instance) => new Skill(instance.id, instance.name, instance.jobId));
    });
  }

  onSave() {
    this.httpClient.put('http://localhost:3000/jobView/' + this.job.id, {
      'title': this.job.title, 'description': this.job.description
    }, {withCredentials: true}).subscribe();
  }

  onDestroy() {
    this.httpClient.delete('http://localhost:3000/jobView/' + this.job.id, {withCredentials: true}).subscribe(() => {
      this.destroy.emit(this.job);
    });
  }

  onSkillCreate() {
    this.skill.jobId = this.job.id;
    this.httpClient.post('http://localhost:3000/skillEdit', {
      'jobId': this.skill.jobId,
      'name': this.skill.name
    }, {withCredentials: true}).subscribe((instance: any) => {
      this.skill.id = instance.id;
      this.skills.push(this.skill);
      this.skill = new Skill(null, '', null);
    });
  }

  onSkillDestroy(skill: Skill) {
    this.skills.splice(this.skills.indexOf(skill), 1);
  }

}
