import {Component, OnInit} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-jobs-view',
  templateUrl: './jobsView.component.html',
  styleUrls: ['./jobsView.component.css']
})
export class JobsViewComponent implements OnInit {
  job: Job = new Job(null, '', '');
  jobs: Job[] = [];
  msg: String = '';

  constructor(private httpClient: HttpClient, private router: Router) {
    this.httpClient.get('http://localhost:3000/login/check', {withCredentials: true}).subscribe(
      (res: any) => {
        console.log(res);
        if (res.value !== null && res.value === 'true') {
          this.router.navigate(['/editJobs']);
        }
      }
    );
  }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/jobView').subscribe((instances: any) => {
      this.jobs = instances.map((instance) => new Job(instance.id, instance.title, instance.description));

      if (this.jobs.length === 0) {
        this.msg = 'Currently there are no Jobs available!';
      }

    });
  }

}
