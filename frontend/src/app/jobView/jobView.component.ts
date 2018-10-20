import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';

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
  formattedstartofwork: string;

  @Output()
  destroy = new EventEmitter<Job>();

  constructor() {
  }

  ngOnInit() {
    this.formattedstartofwork = this.job.startofwork.format('YYYY-MM-DD');
  }
}
