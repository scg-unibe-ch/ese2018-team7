import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDatepicker} from '@angular/material/datepicker';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MarkdownService} from 'ngx-markdown';
import {EditorLocale, EditorOption} from 'angular-markdown-editor';

import {Job} from '../job';
import {Skill} from '../skill';
import {AuthService} from '../auth/auth.service';
import * as moment from 'moment';
import {Moment} from 'moment';
import {Message} from '../message';
import {MenuCountService} from '../menuCount/menuCount.service';
import {JobViewComponent} from '../jobView/jobView.component';
import {Salary} from '../salary';

/**
 * Component to edit a single job
 *
 * This component is wrapped by the [JobsEditComponent]{@link JobsEditComponent.html}.
 */
@Component({
  selector: 'app-job-edit',
  templateUrl: './jobEdit.component.html',
  styleUrls: ['./jobEdit.component.css']
})

export class JobEditComponent implements OnInit {

  /**
   * Job that is edited
   */
  @Input()
  job: Job;

  /**
   * Default skill
   */
  skill: Skill = new Skill ('');

  /**
   * Timestamp of today in moment format
   */
  today: Moment = moment();

  /**
   * Editor options for markdown editor
   */
  editorOptions: EditorOption;

  /**
   * Simple EventEmitter to destroy this component
   */
  @Output()
  destroy = new EventEmitter<Job>();

  /**
   * Datepicker UI for choosing dates and times
   */
  @ViewChild(MatDatepicker)
  datepicker: MatDatepicker<Date>;

  /**
   * German translation for markdown editor
   */
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
      'enter link description here': 'Linkbeschreibung hier einfügen',
      'Insert Hyperlink': 'Link einfügen',
      'enter image description here': 'Bildbeschreibung hier einfügen',
      'Insert Image Hyperlink': 'Bild-URL hier einfügen',
      'enter image title here': 'Bildüberschrift hier einfügen',
      'list text here': 'Eine Liste',
      'code text here': 'Code hier einfügen',
      'quote here': 'Zitat hier einfügen',
    }
  };

  /**
   * @ignore
   */
  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar, private dialog: MatDialog,
              private markdownService: MarkdownService) {
  }

  /**
   * Initialise this component and set parameters for markdown editor
   */
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

  /**
   * Get initial state of displaySalary switch
   */
  displaySalary() {
    return this.job.salary.amount >= 0;
  }

  /**
   * Toggle the displaySalary switch and adjust values if needed
   */
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

  /**
   * Save a single specified property of the job to the server
   * @param type Property that should be saved
   * @param value Value that should be saved
   */
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

  /**
   * Save the contractType property of this job
   */
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

  /**
   * Save the startOfWork property of this job
   */
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

  /**
   * Save the endOfWork property of this job
   */
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

  /**
   * Save the skills of this job
   */
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

  /**
   * Save the dateOfPublication property of this job
   */
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
   * Delete this job on the server
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
   * Add a new skill
   */
  onSkillCreate() {
    this.job.skills.push(this.skill);
    this.skill = new Skill('');
    this.onSaveSkills();
  }

  /**
   * Delete the specified skill
   * @param skill Skill that should be deleted
   */
  onSkillDestroy(skill: Skill) {
    this.job.skills.splice(this.job.skills.indexOf(skill), 1);
    this.onSaveSkills();
  }

  /**
   * Return custom label for workload percentage slider
   */
  percentageLabel(value: number | null): string {
    return value + '%';
  }

  /**
   * Returns if the job could be approved <=> isn't approved and user is admin
   */
  isAdmin(): boolean {
    return AuthService.isModOrAdmin();
  }

  /**
   * Check if all form fields are valid
   * @returns Flag if form is valid
   */
  isValid() {
    return (this.job.phone.match('[0-9+ ]+') &&
            this.job.email.match('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$') &&
            this.job.website.match('(((http|https)\\:\\/\\/){0,1}www\\.){0,1}[a-zA-Z0-9]*\\.[a-zA-Z0-9]{2,10}(\\/.*){0,1}'));
  }

  /**
   * Open SnackBar to inform the user about the incompleteness of the form
   */
  block() {
    this.snackBar.open('Nicht alle obligatorischen Felder ausgefüllt!', null, {duration: 5000});
  }

  /**
   * Approve this job or changes to this job
   */
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

  /**
   * Reset the changes to this job
   */
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

  /**
   * Open a preview window for this job
   */
  showPreview() {
    const dialogRef = this.dialog.open(JobViewComponent, {
      minWidth: '70%',
    });
    dialogRef.componentInstance.job = this.job;
  }

}
