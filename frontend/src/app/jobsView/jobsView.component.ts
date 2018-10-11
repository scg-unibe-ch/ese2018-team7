import {Component, OnInit} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-jobs-view',
  templateUrl: './jobsView.component.html',
  styleUrls: ['./jobsView.component.css']
})
export class JobsViewComponent implements OnInit {
  job: Job = new Job(null, '', '', '');
  jobs: Job[] = [];
  msg: String = '';

  constructor(private httpClient: HttpClient, private router: Router) {
    if (AuthService.isLogin()) {
      this.router.navigate(['/editJobs']);
    }
  }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/jobView').subscribe((instances: any) => {
      this.jobs = instances.map((instance) => new Job(instance.id, instance.title, instance.company, instance.description));

      if (this.jobs.length === 0) {
        this.msg = 'Currently there are no Jobs available!';
      }

    });
  }

}
