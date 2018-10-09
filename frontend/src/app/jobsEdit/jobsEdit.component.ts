import {Component, OnInit} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-jobs-edit',
  templateUrl: './jobsEdit.component.html',
  styleUrls: ['./jobsEdit.component.css']
})
export class JobsEditComponent implements OnInit {
  job: Job = new Job(null, '', '', '');
  jobs: Job[] = [];

  constructor(private httpClient: HttpClient, private router: Router) {
    this.httpClient.get('http://localhost:3000/login/check', {withCredentials: true}).subscribe(
      (res: any) => {
        console.log(res);
        if (res.value === null || res.value !== 'true') {
          this.router.navigate(['/login']);
        }
      }
    );

  }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/jobView').subscribe((instances: any) => {
      this.jobs = instances.map((instance) => new Job(instance.id, instance.title, instance.company, instance.description));
    });
  }

  onJobsCreate() {
    this.httpClient.post('http://localhost:3000/jobView', {
      'title': this.job.title, 'company': this.job.company, 'description': this.job.description,
    }).subscribe((instance: any) => {
      this.job.id = instance.id;
      this.jobs.push(this.job);
      this.job = new Job(null, '', '', '');
    });
  }

  onJobsDestroy(job: Job) {
    this.jobs.splice(this.jobs.indexOf(job), 1);
  }

}
