import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {Skill} from '../skill';
import {AuthService} from '../auth/auth.service';
import {MatDatepicker} from '@angular/material/datepicker';
import * as moment from 'moment';
import {Moment} from 'moment';
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

  onSaveTitle() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'title': this.job.title,
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

  onSaveDepartment() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'department': this.job.department,
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

  onSavePlaceOfWork() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'placeOfWork': this.job.placeOfWork,
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

  onSaveContractType() {
    if (this.job.contractType === 'temporary') {
      this.job.endOfWork = moment(this.job.startOfWork.unix(), 'X');
      this.job.endOfWork.add(1, 'y').subtract(1, 'd').endOf('day');
    } else {
      this.job.endOfWork = moment(0);
    }

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
      alert(Message.getMessage(err.error.code));
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
      alert(Message.getMessage(err.error.code));
    });
  }

  onSaveWorkload() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'workload': this.job.workload,
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

  onSaveShortDescription() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'shortDescription': this.job.shortDescription,
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

  onSaveDescription() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'description': this.job.description,
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
      alert(Message.getMessage(err.error.code));
    });
  }

  onSavePhone() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'phone': this.job.phone,
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

  onSaveEmail() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'email': this.job.email,
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

  onSaveContactInfo() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'contactInfo': this.job.contactInfo,
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

  onSaveStartOfPublication() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'startOfPublication': this.job.startOfPublication.unix(),
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

  onSaveEndOfPublication() {
    this.httpClient.put('/jobs/' + this.job.id, {
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
   * Save changed to the Server
   * Currently unused but kept in code if needed later
   */
  onSave() {
    this.httpClient.put('/jobs/' + this.job.id, {
      'title': this.job.title,
      'department': this.job.department,
      'placeOfWork': this.job.placeOfWork,
      'contractType': this.job.contractType,
      'startOfWork': this.job.startOfWork.startOf('day').unix(),
      'endOfWork': this.job.endOfWork.endOf('day').unix(),
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
      this.job.startOfWork = moment(res.startOfWork, 'X').startOf('day');
      this.job.endOfWork = res.endOfWork;
      this.job.endOfWork = moment(res.endOfWork, 'X').endOf('day');
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
