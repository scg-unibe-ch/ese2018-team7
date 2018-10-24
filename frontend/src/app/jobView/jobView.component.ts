import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {ModalService} from '../modal/modal.service';

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
  formattedDescription: string;

  @Output()
  destroy = new EventEmitter<Job>();

  constructor(private modalService: ModalService) {
  }

  ngOnInit() {
    this.formattedstartofwork = this.job.startofwork.format('DD.MM.YYYY');
    this.formattedDescription = this.job.description.replace('\n', '<br>');
  }
  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
