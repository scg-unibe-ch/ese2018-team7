import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {Skill} from '../skill';
import {AuthService} from '../auth/auth.service';
import {MatDatepicker} from '@angular/material/datepicker';
import * as moment from 'moment';
import {Moment} from 'moment';
import {FormControl, Validators} from '@angular/forms';
import {Message} from '../message';

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

  onSaveContractType() {
    if (this.job.contractType === 'temporary') {
      this.job.endOfWork = moment().add(1, 'y');
    } else {
      this.job.endOfWork = moment(0);
    }

    this.onSave();
  }

  /**
   * Save changed to the Server
   */
  onSave() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'title': this.job.title,
      'department': this.job.department,
      'placeOfWork': this.job.placeOfWork,
      'contractType': this.job.contractType,
      'startOfWork': this.job.startOfWork.unix(),
      'endOfWork': this.job.endOfWork.unix(),
      'workload': this.job.workload,
      'shortDescription': this.job.shortDescription,
      'description': this.job.description,
      'skills': JSON.stringify(this.job.skills),
      'phone': this.job.phone,
      'email': this.job.email,
      'contactInfo': this.job.contactInfo,
      'startOfPublication': this.job.startOfPublication.unix(),
      'endOfPublication': this.job.endOfPublication.unix(),
      'approved': this.job.approved
    }, {withCredentials: true}).subscribe((answer: any) => {
      console.log(answer);
      this.job.changed = answer.changed;
      this.job.approved = answer.approved;
    }, err => {
      console.error(err.error.message);
      alert(Message.getMessage(err.error.code));
    });
  }

  /**
   * Deletes the Job from the Server
   */
  onDestroy() {
    this.httpClient.delete('/jobs/' + this.job.id, {withCredentials: true}).subscribe(() => {
      this.destroy.emit(this.job);
    }, err => {
      console.error(err.error.message);
      alert(Message.getMessage(err.error.code));
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
      this.httpClient.put('/jobs/apply/' + this.job.id, {}, {withCredentials: true}).subscribe((res: any) => {
        this.job.approved = res.approved;
        this.job.changed = res.changed;
      }, err => {
        console.error(err.error.message);
        alert(Message.getMessage(err.error.code));
      });
    }
  }
  resetJob() {
    this.httpClient.put('/jobs/reset/' + this.job.id, {}, {withCredentials: true}).subscribe((res: any) => {
      this.job.title = res.title;
      this.job.department = res.department;
      this.job.placeOfWork = res.placeOfWork;
      this.job.contractType = res.contractType;
      this.job.startOfWork = res.startOfWork;
      this.job.startOfWork = moment(res.startOfWork, 'X');
      this.job.endOfWork = res.endOfWork;
      this.job.endOfWork = moment(res.endOfWork, 'X');
      this.job.workload = res.workload;
      this.job.shortDescription = res.shortDescription;
      this.job.description = res.description;
      this.job.skills = JSON.parse(res.skills);
      this.job.phone = res.phone;
      this.job.email = res.email;
      this.job.contactInfo = res.contactInfo;
      this.job.startOfPublication = moment(res.startOfPublication, 'X');
      this.job.endOfPublication = moment(res.endOfPublication, 'X');
      this.job.approved = res.approved;
      this.job.changed = res.changed;
    }, err => {
      console.error(err.error.message);
      alert(Message.getMessage(err.error.code));
    });
  }
}
