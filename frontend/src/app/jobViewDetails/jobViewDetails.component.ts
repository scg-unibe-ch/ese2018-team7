import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {Job} from '../job';

/**
 * Component to display all the details of a single job
 */
@Component({
  selector: 'app-job-view-details',
  templateUrl: './jobViewDetails.component.html',
  styleUrls: ['./jobViewDetails.component.css']
})

export class JobViewDetailsComponent implements OnInit {

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
   * Create a new instance of this component with the given parameters
   * @param dialogRef Reference to where this component was instanciated from
   * @param data Data variable that contains the job
   */
  constructor(public dialogRef: MatDialogRef<JobViewDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.job = this.data.job;
    this.formattedStartOfWork = this.data.formattedStartOfWork;
    this.formattedEndOfWork = this.data.formattedEndOfWork;
    this.formattedDescription = this.data.formattedDescription;
    this.formattedContactInfo = this.data.formattedContactInfo;
    this.obscuredMail = this.data.obscuredMail;
  }

  /**
   * @ignore
   */
  ngOnInit(): void {
  }

  /**
   * Close the dialog window if the user clicks outside of it
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Open default email client with new email to the email address saved in this job
   */
  sendMail() {
    window.location.href = 'mailto:' + this.job.email;
  }

  /**
   * Open the website of this job in a new window
   */
  openWebsite() {
    let web = this.job.website;
    if (web.indexOf('http') === -1) {
      web = 'http://' + web;
    }

    const win = window.open(web, '_blank');
    win.focus();
  }

}
