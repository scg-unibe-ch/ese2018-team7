import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {Skill} from '../skill';
import {AuthService} from '../auth/auth.service';
import {MatDatepicker} from '@angular/material/datepicker';
import * as moment from 'moment';
import {Moment} from 'moment';
import {Message} from '../message';
import {MatDialog, MatSnackBar} from '@angular/material';
import {JobViewComponent} from '../jobView/jobView.component';

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

  today: Moment = moment();

  @Output()
  destroy = new EventEmitter<Job>();
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  onSaveSingle(type: string, value: string) {

    this.httpClient.put('/jobs/' + this.job.id, {
      [type]: value,
      'approved': this.job.approved
    }, {withCredentials: true}).subscribe((answer: any) => {
      console.log(answer);
      this.job.changed = answer.changed;
      this.job.approved = answer.approved;
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 3000});
    });
  }

  onSaveContractType() {
    console.log('save: ' + this.job.contractType);
    if (this.job.contractType === 'temporary') {
      this.job.endOfWork = moment(this.job.startOfWork.unix(), 'X');
      this.job.endOfWork.add(1, 'y').subtract(1, 'd').endOf('day');
    } else {
      this.job.endOfWork = moment(0);
    }
    this.onSaveSingle('contractType', this.job.contractType);
    this.onSaveEndOfWork();
  }

  onSaveStartOfWork() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'startOfWork': this.job.startOfWork.startOf('day').unix(),
      'approved': this.job.approved
    }, {withCredentials: true}).subscribe((answer: any) => {
      console.log(answer);
      this.job.changed = answer.changed;
      this.job.approved = answer.approved;
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 3000});
    });
  }

  onSaveEndOfWork() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'endOfWork': this.job.endOfWork.endOf('day').unix(),
      'approved': this.job.approved
    }, {withCredentials: true}).subscribe((answer: any) => {
      console.log(answer);
      this.job.changed = answer.changed;
      this.job.approved = answer.approved;
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 3000});
    });
  }

  onSaveSkills() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'skills': JSON.stringify(this.job.skills),
      'approved': this.job.approved
    }, {withCredentials: true}).subscribe((answer: any) => {
      console.log(answer);
      this.job.changed = answer.changed;
      this.job.approved = answer.approved;
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 3000});
    });
  }

  onSaveDateOfPublication(type: string, value: Moment) {
    this.httpClient.put('/jobs/' + this.job.id, {
      [type]: value.unix(),
      'approved': this.job.approved
    }, {withCredentials: true}).subscribe((answer: any) => {
      console.log(answer);
      this.job.changed = answer.changed;
      this.job.approved = answer.approved;
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 3000});
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
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 3000});
    });
  }

  /**
   * Adding a Skill
   */
  onSkillCreate() {
    this.skill.jobId = this.job.id;
    this.job.skills.push(this.skill);
    this.skill = new Skill(null, '', null);
    this.onSaveSkills();
  }

  /**
   * Deleting a Skill
   */
  onSkillDestroy(skill: Skill) {
    this.job.skills.splice(this.job.skills.indexOf(skill), 1);
    this.onSaveSkills();
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
  isValid() {
    return (this.job.phone.match('[0-9+ ]+') &&
            this.job.email.match('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$') &&
            this.job.website.match('^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?'));
  }
  block() {
    this.snackBar.open('Nicht alle obligatorischen Felder ausgefüllt!', null, {duration: 3000});
  }

  approve() {
    if (AuthService.isModOrAdmin()) {
      this.httpClient.put('/jobs/apply/' + this.job.id, {}, {withCredentials: true}).subscribe((res: any) => {
        this.job.approved = res.approved;
        this.job.changed = res.changed;
      }, err => {
        console.error(err.error.message);
        this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 3000});
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
      this.job.startOfWork = moment(res.startOfWork, 'X').startOf('day');
      this.job.endOfWork = res.endOfWork;
      this.job.endOfWork = moment(res.endOfWork, 'X').endOf('day');
      this.job.workload = res.workload;
      this.job.shortDescription = res.shortDescription;
      this.job.description = res.description;
      this.job.skills = JSON.parse(res.skills);
      this.job.phone = res.phone;
      this.job.email = res.email;
      this.job.website = res.website;
      this.job.contactInfo = res.contactInfo;
      this.job.startOfPublication = moment(res.startOfPublication, 'X');
      this.job.endOfPublication = moment(res.endOfPublication, 'X');
      this.job.approved = res.approved;
      this.job.changed = res.changed;
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 3000});
    });
  }
  showPreview() {
    const dialogRef = this.dialog.open(JobViewComponent, {
      minWidth: '70%',
    });
    dialogRef.componentInstance.job = this.job;
  }

}
