import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {Skill} from '../skill';
import {AuthService} from '../auth/auth.service';
import {MatDatepicker} from '@angular/material/datepicker';
import * as moment from 'moment';
import {Moment} from 'moment';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-job-edit',
  templateUrl: './jobEdit.component.html',
  styleUrls: ['./jobEdit.component.css']
})
/**
 * Component to edit one Job
 */
export class JobEditComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  phoneFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^(\\+?)(\\d{2,4})(\\s?)(\\-?)((\\(0\\))?)(\\s?)' +
      '(\\d{2})(\\s?)(\\-?)(\\d{3})(\\s?)(\\-?)(\\d{2})(\\s?)(\\-?)(\\d{2})'),
  ]);

  @Input()
  job: Job;
  skill: Skill = new Skill (null, '', null);

  today: Moment = moment();

  @Output()
  destroy = new EventEmitter<Job>();
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
  }

  /**
   * Save changed to the Server
   */
  onSave() {
    this.httpClient.put('http://localhost:3000/jobs/' + this.job.id, {
      'title': this.job.title,
      'departement': this.job.departement,
      'placeofwork': this.job.placeofwork,
      'startofwork': this.job.startofwork.unix(),
      'workload': this.job.workload,
      'description': this.job.description,
      'skills': JSON.stringify(this.job.skills),
      'phone': this.job.phone,
      'email': this.job.email,
      'contactinfo': this.job.contactinfo,
      'startofpublication': this.job.startofpublication.unix(),
      'endofpublication': this.job.endofpublication.unix(),
      'approved': this.job.approved
    }, {withCredentials: true}).subscribe((answer: any) => {
      console.log(answer);
      this.job.changed = true;
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
    this.job.skills.push(this.skill);
    this.skill = new Skill(null, '', null);
    this.onSave();
  }

  /**
   * Deleting a Skill
   */
  onSkillDestroy(skill: Skill) {
    this.job.skills.splice(this.job.skills.indexOf(skill), 1);
    this.onSave();
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
  isAdmin() {
    return AuthService.isModOrAdmin();
  }

  approve() {
    if (AuthService.isModOrAdmin()) {
      this.httpClient.put('http://localhost:3000/jobs/apply/' + this.job.id, {}, {withCredentials: true}).subscribe(res => {
        this.job.approved = true;
        this.job.changed = false;
      });
    }
  }
  resetJob() {
    this.httpClient.put('http://localhost:3000/jobs/reset/' + this.job.id, {}, {withCredentials: true}).subscribe((res: any) => {
      this.job.changed = false;
      this.job.title = res.title;
      this.job.departement = res.departement;
      this.job.placeofwork = res.placeofwork;
      this.job.startofwork = res.startofwork;
      this.job.startofwork = moment(res.startofwork, 'X');
      this.job.workload = res.workload;
      this.job.description = res.description;
      this.job.skills = JSON.parse(res.skills);
      this.job.phone = res.phone;
      this.job.email = res.email;
      this.job.contactinfo = res.contactinfo;
      this.job.startofpublication = moment(res.startofpublication, 'X');
      this.job.endofpublication = moment(res.endofpublication, 'X');
      this.job.approved = res.approved;
    });
  }
}
