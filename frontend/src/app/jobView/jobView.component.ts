import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {JobViewDetailsComponent} from '../jobViewDetails/jobViewDetails.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-job-view',
  templateUrl: './jobView.component.html',
  styleUrls: ['./jobView.component.css']
})
/**
 * Component to display one Job
 */
export class JobViewComponent implements OnInit {

  // The Job
  @Input()
  job: Job;
  formattedStartOfWork: string;
  formattedEndOfWork: string;
  formattedDescription: string;
  formattedContactInfo: string;
  obscuredMail: string;

  @Output()
  destroy = new EventEmitter<Job>();

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.formattedStartOfWork = this.job.startOfWork.format('DD.MM.YYYY');
    this.formattedEndOfWork = this.job.endOfWork.format('DD.MM.YYYY');
    this.formattedDescription = this.job.description.replace(/\n/g, '<br>');
    this.formattedContactInfo = this.job.contactInfo.replace(/\n/g, '<br>');
    this.obscuredMail = this.job.email.replace('@', ' [AT] ').replace('.', ' [DOT] ');
  }
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
