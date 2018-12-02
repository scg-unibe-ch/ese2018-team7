import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {JobViewDetailsComponent} from '../jobViewDetails/jobViewDetails.component';
import {MatDialog} from '@angular/material';
import * as moment from 'moment';

/**
 * Component to display a single job
 */
@Component({
  selector: 'app-job-view',
  templateUrl: './jobView.component.html',
  styleUrls: ['./jobView.component.css']
})

export class JobViewComponent implements OnInit {

  /**
   * Job that should be displayed
   */
  @Input()
  job: Job;

  /**
   * Formatted string for startOfWork
   */
  formattedStartOfWork: string;

  /**
   * Formatted string for endOfWork
   */
  formattedEndOfWork: string;

  /**
   * Formatted html string for detailed description
   */
  formattedDescription: string;

  /**
   * Formatted html string for additional contact info
   */
  formattedContactInfo: string;

  /**
   * Formatted string for obscured email address to prevent spamming by crawlers and bots
   */
  obscuredMail: string;

  /**
   * Simple EventEmitter to destroy this component
   */
  @Output()
  destroy = new EventEmitter<Job>();

  /**
   * @ignore
   */
  constructor(private dialog: MatDialog) {
  }

  /**
   * Initialise this component by filling all the special formatted value variables with their data
   */
  ngOnInit() {
    this.formattedStartOfWork = moment() > this.job.startOfWork ? 'per sofort' :
      'am ' + this.job.startOfWork.format('DD.MM.YYYY');
    this.formattedEndOfWork = this.job.endOfWork.format('DD.MM.YYYY');
    this.formattedDescription = this.job.description.replace(/\n/g, '<br>');
    this.formattedContactInfo = this.job.contactInfo.replace(/\n/g, '<br>');
    this.obscuredMail = this.job.email.replace('@', ' [AT] ').replace('.', ' [DOT] ');
  }

  /**
   * Open a detailed view of the job in a dialog window
   *
   * See the [jobViewDetails Component]{@link JobViewDetailsComponent.html} for more information
   */
  openDetails(): void {
    this.dialog.open(JobViewDetailsComponent, {
      minWidth: '90%',
      minHeight: '90%',
      data: {
        job: this.job,
        formattedStartOfWork: this.formattedStartOfWork,
        formattedEndOfWork: this.formattedEndOfWork,
        formattedDescription: this.formattedDescription,
        formattedContactInfo: this.formattedContactInfo,
        obscuredMail: this.obscuredMail
      }
    });
  }

}
