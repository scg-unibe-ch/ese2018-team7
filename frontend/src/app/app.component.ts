import {Component, OnInit} from '@angular/core';
import {Job} from './job';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  job: Job = new Job(null, '', '');
  jobs: Job[] = [];

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/job').subscribe((instances: any) => {
      this.jobs = instances.map((instance) => new Job(instance.id, instance.title, instance.description));
    });
  }

  onJobsCreate() {
    this.httpClient.post('http://localhost:3000/job', {
      'title': this.job.title, 'description': this.job.description,
    }).subscribe((instance: any) => {
      this.job.id = instance.id;
      this.jobs.push(this.job);
      this.job = new Job(null, '', '');
    });
  }

  onJobsDestroy(job: Job) {
    this.jobs.splice(this.jobs.indexOf(job), 1);
  }

}
