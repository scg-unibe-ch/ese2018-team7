import {Component, EventEmitter, OnInit} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import {ModalService} from '../modal/modal.service';
import {Moment} from 'moment';
import {Company} from '../company';

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

  // Easy Search query variable
  searchParam = '';

  // Advanced Search variables
  advSearchTitle = '';
  advSearchCompany = '';
  advSearchStartAfter: Moment =  moment().subtract(1, 'w');
  advSearchStartBefore: Moment = moment().add(1, 'y');
  advSearchWorkLoadGt = 0;
  advSearchWorkLoadLt = 100;

  // To manually refreh Range bar -> needed...
  advSearchRangeRefresh: EventEmitter<void> = new EventEmitter<void>();

  searched = false;

  constructor(private httpClient: HttpClient, private modalService: ModalService) {
  }

  ngOnInit() {

    // Load the Jobs from the Server
    this.httpClient.get('http://localhost:3000/jobs').subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>
        new Job(instance.id,
          instance.title,
          instance.departement,
          instance.placeofwork,
          moment(instance.startofwork, 'X'),
          instance.workload,
          instance.description,
          JSON.parse(instance.skills),
          instance.contactinfo,
          new Company('', instance.companyName, instance.companyLogo)));

      if (this.jobs.length === 0) {
        this.msg = 'Currently there are no Jobs available!';
      } else {
        this.msg = '';
      }
      this.advSearchRangeRefresh.emit();

    });
  }

  onEasySearch() {

    // Load the Jobs from the Server
    this.httpClient.get('http://localhost:3000/jobs/search?title=' + this.searchParam).subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>
        new Job(instance.id,
          instance.title,
          instance.departement,
          instance.placeofwork,
          moment(instance.startofwork, 'X'),
          instance.workload,
          instance.description,
          JSON.parse(instance.skills),
          instance.contactinfo,
          new Company(instance.companyName, instance.companyLogo)));

      if (this.jobs.length === 0) {
        this.msg = 'There are currently no Jobs available for your search!';
      } else {
        this.msg = '';
      }
      this.searched = true;
    });
  }
  onAdvancedSearch() {

    // Load the Jobs from the Server
    this.httpClient.get('http://localhost:3000/jobs/search?' +
      'title=' + this.advSearchTitle + '&' +
      'company=' + this.advSearchCompany + '&' +
      'startAfter=' + this.advSearchStartAfter.unix() + '&' +
      'startBefore=' + this.advSearchStartBefore.unix() + '&' +
      'workloadGt=' + this.advSearchWorkLoadGt + '&' +
      'workloadLt=' + this.advSearchWorkLoadLt
    ).subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>
        new Job(instance.id,
          instance.title,
          instance.departement,
          instance.placeofwork,
          moment(instance.startofwork, 'X'),
          instance.workload,
          instance.description,
          JSON.parse(instance.skills),
          instance.contactinfo,
          new Company(instance.companyName, instance.companyLogo),
          moment(instance.startofpublication, 'X'),
          moment(instance.endofpublication, 'X')));

      if (this.jobs.length === 0) {
        this.msg = 'There are currently no Jobs available for your search!';
      } else {
        this.msg = '';
      }
      this.searched = true;
    });
  }
  resetSearch() {
    this.searchParam = '';
    this.advSearchTitle = '';
    this.advSearchCompany = '';
    this.advSearchStartAfter =  moment().subtract(1, 'w');
    this.advSearchStartBefore = moment().add(1, 'y');
    this.advSearchWorkLoadGt = 0;
    this.advSearchWorkLoadLt = 100;
    this.searched = false;
    this.httpClient.get('http://localhost:3000/jobs').subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>
        new Job(instance.id,
          instance.title,
          instance.departement,
          instance.placeofwork,
          moment(instance.startofwork, 'X'),
          instance.workload,
          instance.description,
          JSON.parse(instance.skills),
          instance.contactinfo,
          new Company(instance.companyName, instance.companyLogo),
          moment(instance.startofpublication, 'X'),
          moment(instance.endofpublication, 'X')));

      if (this.jobs.length === 0) {
        this.msg = 'Currently there are no Jobs available!';
      } else {
        this.msg = '';
      }
      this.advSearchRangeRefresh.emit();
    });
  }
  openModal(id: string) {
    this.advSearchRangeRefresh.emit();
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
