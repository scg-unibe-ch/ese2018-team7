import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

/**
 * Component to display a detailed search form
 */
@Component({
  selector: 'app-jobs-advanced-search',
  templateUrl: './jobsAdvancedSearch.component.html',
  styleUrls: ['./jobsAdvancedSearch.component.css']
})

export class JobsAdvancedSearchComponent implements OnInit {

  /**
   * EventEmitter to manually refresh the range bar
   */
  advSearchRangeRefresh: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @ignore
   */
  constructor(public dialogRef: MatDialogRef<JobsAdvancedSearchComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  /**
   * Initialise this component
   */
  ngOnInit() {
      this.advSearchRangeRefresh.emit();
  }

  /**
   * Perform the actual advanced search
   */
  onAdvancedSearch() {
    this.data.doSearch = true;
    this.dialogRef.close(this.data);
  }

}
