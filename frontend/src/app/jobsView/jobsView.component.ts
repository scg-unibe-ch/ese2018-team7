import {Component, OnInit} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-jobs-view',
  templateUrl: './jobsView.component.html',
  styleUrls: ['./jobsView.component.css']
})

/**
 * Component to display all approved Jobs
 */
export class JobsViewComponent implements OnInit {

  // Array of all approved Jobs
  jobs: Job[] = [];

  // Variable to return values to the user
  msg: String = '';

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {

    // Load the Jobs from the Server
    this.httpClient.get('http://localhost:3000/jobs').subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>
        new Job(instance.id, instance.title, instance.company, instance.placeofwork, instance.description, instance.approved));

      if (this.jobs.length === 0) {
        this.msg = 'Currently there are no Jobs available!';
      }

    });
  }

}
