import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Job} from '../job';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Skill} from '../skill';
import {AuthService} from '../auth/auth.service';
import {MatDatepicker} from '@angular/material/datepicker';

@Component({
  selector: 'app-job-edit',
  templateUrl: './jobEdit.component.html',
  styleUrls: ['./jobEdit.component.css']
})
/**
 * Component to edit one Job
 */
export class JobEditComponent implements OnInit {

  @Input()
  job: Job;
  skill: Skill = new Skill (null, '', null);
  skills: Skill[] = [];
  @Output()
  destroy = new EventEmitter<Job>();
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {

    // Load the skills of this Job from the server
    this.httpClient.get('http://localhost:3000/skills', {
      params:  new HttpParams().set('jobId', '' + this.job.id), withCredentials: true
    }).subscribe((instances: any) => {
      this.skills = instances.map((instance) => new Skill(instance.id, instance.name, instance.jobId));
    });

  }

  /**
   * Save changes to the Server
   */
  onSave(approved: boolean = false) {
    console.log(this.job);
    this.httpClient.put('http://localhost:3000/jobs/' + this.job.id, {
      'title': this.job.title,
      'company': this.job.company,
      'placeofwork': this.job.placeofwork,
      'startofwork': this.job.startofwork.unix(),
      'workload': this.job.workload,
      'description': this.job.description,
      'contactinfo': this.job.contactinfo,
      'approved': approved
    }, {withCredentials: true}).subscribe( res => {
        this.job.approved = approved;
    });
  }

  /**
   * Deletes the Job from the Server
   */
  onDestroy() {
    this.httpClient.delete('http://localhost:3000/jobs/' + this.job.id, {withCredentials: true}).subscribe(() => {
      this.destroy.emit(this.job);
    });
  }

  /**
   * Adding a Skill
   */
  onSkillCreate() {
    this.skill.jobId = this.job.id;
    this.httpClient.post('http://localhost:3000/skills', {
      'jobId': this.skill.jobId,
      'name': this.skill.name
    }, {withCredentials: true}).subscribe((instance: any) => {
      this.skill.id = instance.id;
      this.skills.push(this.skill);
      this.skill = new Skill(null, '', null);
    });
  }

  /**
   * Deleting a Skill
   */
  onSkillDestroy(skill: Skill) {
    this.skills.splice(this.skills.indexOf(skill), 1);
  }

  /**
   * Custom label for workload percentage slider
   */
  percentageLabel(value: number | null) {
    return value + '%';
  }

  /**
   * Returns if the job could be approved <=> isn't approved and user is admin
   */
  isApprovable() {
    return AuthService.isAdmin() && !this.job.approved;
  }

}
