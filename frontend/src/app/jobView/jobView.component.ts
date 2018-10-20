import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Skill} from '../skill';
import {Company} from '../company';

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
  company: Company;
  formattedstartofwork: string;

  @Output()
  destroy = new EventEmitter<Job>();

  constructor(private httpClient: HttpClient) {
    this.company = new Company('', '', '');
  }

  ngOnInit() {
    this.formattedstartofwork = this.job.startofwork.format('YYYY-MM-DD');

    // Load Company from the server
    this.httpClient.get('http://localhost:3000/jobs/company/' + this.job.id).subscribe((instance: any) => {
      this.company =  new Company('', instance.name, instance.logo);
    });
  }
}
