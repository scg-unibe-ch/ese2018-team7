import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {Skill} from '../skill';
import {AuthService} from '../auth/auth.service';
import {MatDatepicker} from '@angular/material/datepicker';
import * as moment from 'moment';
import {Moment} from 'moment';
import {Message} from '../message';
import {MenuCountService} from '../menuCount/menuCount.service';
import {MatDialog, MatSlideToggle, MatSnackBar} from '@angular/material';
import {JobViewComponent} from '../jobView/jobView.component';
import {EditorLocale, EditorOption} from 'angular-markdown-editor';
import {MarkdownService} from 'ngx-markdown';
import {Salary} from '../salary';


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
  skill: Skill = new Skill ('');

  today: Moment = moment();
  editorOptions: EditorOption;

  @Output()
  destroy = new EventEmitter<Job>();
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;

  locale: EditorLocale = {
    language: 'de',
    dictionary: {
      'Bold': 'Fett',
      'Italic': 'Kursiv',
      'Heading': 'Titel',
      'URL/Link': 'HTTP-Link',
      'Image': 'Bild einfügen',
      'List': 'Aufzählungsliste',
      'Ordered List': 'Geordnete Liste',
      'Unordered List': 'Ungeordnete Liste',
      'Code': 'Code',
      'Quote': 'Zitat',
      'Preview': 'Vorschau',
      'Strikethrough': 'Durchgestrichen',
      'Table': 'Tabelle',
      'strong text': 'fetter Text',
      'emphasized text': 'unterstrichener Text',
      'heading text': 'Titeltext',
      'enter link description here': 'Linkbeschreibung hier Einfügen',
      'Insert Hyperlink': 'Link zum Einfügen',
      'enter image description here': 'Füge Bildbeschreibung hier ein',
      'Insert Image Hyperlink': 'Gib die Bildaddresse hier an',
      'enter image title here': 'Füge Bildüberschrift hier ein',
      'list text here': 'Eine Liste',
      'code text here': 'Code hier einfügen',
      'quote here': 'Zitat hier einfügen',
    }
  };

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar, private dialog: MatDialog,
              private markdownService: MarkdownService) {
  }

  ngOnInit() {
    this.editorOptions = {
      iconlibrary: 'fa',
      language: 'de',
      fullscreen: {
        enable: false,
        icons: null,
      },
      additionalButtons: [
        [{
            name: 'groupMisc',
            data: [{
              name: 'cmdTable',
              toggle: false,
              title: 'Table',
              icon: {
                fa: 'fa fa-table',
                glyph: 'glyphicon glyphicon-th'
              },
              callback: (e) => {
                // Replace selection with some drinks
                let chunk;
                let cursor;
                const selected = e.getSelection();

                chunk = '\n| Tabellen        | sind          | cool  | \n'
                  + '| --------------- |:-------------:| -----:| \n'
                  + '| Spalte 3 ist    | rechtsbündig | $1600 | \n'
                  + '| Spalte 2 ist    | zentriert     |   $12 |';

                // transform selection and set the cursor into chunked text
                e.replaceSelection(chunk);
                cursor = selected.start;

                // Set the cursor
                e.setSelection(cursor, cursor + chunk.length);
              }
            }]
          }]
        ],
      onChange: (e) => console.log(e.getContent()),
      parser: (val) => this.markdownService.compile(val.trim())
    };
  }

  displaySalary() {
    return this.job.salary.amount >= 0;
  }
  changeToggleSalary() {
    if (this.job.salary.amount >= 0) {
      this.job.salary.amount = -1;
      this.job.salary.period = 'month';
    } else {
      this.job.salary.amount = 0;
      this.job.salary.period = 'month';
    }
    this.onSaveSingle('salary', this.job.salary.toString());
  }

  onSaveSingle(type: string, value: string) {
    this.httpClient.put('/jobs/' + this.job.id, {
      [type]: value,
      'approved': this.job.approved
    }, {withCredentials: true}).subscribe((answer: any) => {
      console.log(answer);
      this.job.changed = answer.changed;
      this.job.approved = answer.approved;
      MenuCountService.update(this.httpClient);
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
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
      MenuCountService.update(this.httpClient);
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
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
      MenuCountService.update(this.httpClient);
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
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
      MenuCountService.update(this.httpClient);
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
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
      MenuCountService.update(this.httpClient);
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }

  /**
   * Deletes the Job from the Server
   */
  onDestroy() {
    this.httpClient.delete('/jobs/' + this.job.id, {withCredentials: true}).subscribe(() => {
      this.destroy.emit(this.job);
      MenuCountService.update(this.httpClient);
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }

  /**
   * Adding a Skill
   */
  onSkillCreate() {
    this.job.skills.push(this.skill);
    this.skill = new Skill('');
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
            this.job.website.match('(((http|https)\\:\\/\\/){0,1}www\\.){0,1}[a-zA-Z0-9]*\\.[a-zA-Z0-9]{2,10}(\\/.*){0,1}'));
  }
  block() {
    this.snackBar.open('Nicht alle obligatorischen Felder ausgefüllt!', null, {duration: 5000});
  }

  approve() {
    if (AuthService.isModOrAdmin()) {
      this.httpClient.put('/jobs/apply/' + this.job.id, {}, {withCredentials: true}).subscribe((res: any) => {
        this.job.approved = res.approved;
        this.job.changed = res.changed;
        MenuCountService.update(this.httpClient);
      }, err => {
        console.error(err.error.message);
        this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
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
      this.job.salary = new Salary().fromString(res.salary);
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
      MenuCountService.update(this.httpClient);
    }, err => {
      console.error(err.error.message);
      this.snackBar.open(Message.getMessage(err.error.code), null, {duration: 5000});
    });
  }
  showPreview() {
    const dialogRef = this.dialog.open(JobViewComponent, {
      minWidth: '70%',
    });
    dialogRef.componentInstance.job = this.job;
  }

}
