import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Skill} from '../skill';

@Component({
  selector: 'app-jobs',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  @Input()
  job: Job;
  skill: Skill = new Skill (null, '', null);
  skills: Skill[] = [];
  @Output()
  destroy = new EventEmitter<Job>();

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/skill', {
      params:  new HttpParams().set('jobId', '' + this.job.id)
    }).subscribe((instances: any) => {
      this.skills = instances.map((instance) => new Skill(instance.id, instance.name, instance.jobId));
    });
  }

  onSave() {
    this.httpClient.put('http://localhost:3000/job/' + this.job.id, {
      'title': this.job.title, 'description': this.job.description
    }).subscribe();
  }

  onDestroy() {
    this.httpClient.delete('http://localhost:3000/job/' + this.job.id).subscribe(() => {
      this.destroy.emit(this.job);
    });
  }

  onSkillCreate() {
    this.skill.jobId = this.job.id;
    this.httpClient.post('http://localhost:3000/skill', {
      'jobId': this.skill.jobId,
      'name': this.skill.name
    }).subscribe((instance: any) => {
      this.skill.id = instance.id;
      this.skills.push(this.skill);
      this.skill = new Skill(null, '', null);
    });
  }

  onSkillDestroy(skill: Skill) {
    this.skills.splice(this.skills.indexOf(skill), 1);
  }

}
