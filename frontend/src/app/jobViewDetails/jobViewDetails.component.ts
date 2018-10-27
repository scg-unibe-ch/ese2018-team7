import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-job-view-details',
  templateUrl: './jobViewDetails.component.html',
  styleUrls: ['./jobViewDetails.component.css']
})
/**
 * Component to display details of one Job
 */
export class JobViewDetailsComponent implements OnInit {

  // The Job
  @Input()
    job: Job;
  formattedStartOfWork: string;
  formattedDescription: string;
  obscuredMail: string;

  @Output()
  destroy = new EventEmitter<Job>();

  constructor(public dialogRef: MatDialogRef<JobViewDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.job = this.data.job;
    this.formattedStartOfWork = this.data.formattedStartOfWork;
    this.formattedDescription = this.data.formattedDescription;
    this.obscuredMail = this.data.obscuredMail;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
