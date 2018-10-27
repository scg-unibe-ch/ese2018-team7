import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-jobs-advanced-search',
  templateUrl: './jobsAdvancedSearch.component.html',
  styleUrls: ['./jobsAdvancedSearch.component.css']
})

/**
 * Component to display all approved Jobs
 */
export class JobsAdvancedSearchComponent implements OnInit {

  // To manually refreh Range bar -> needed...
  advSearchRangeRefresh: EventEmitter<void> = new EventEmitter<void>();


  constructor(public dialogRef: MatDialogRef<JobsAdvancedSearchComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
      this.advSearchRangeRefresh.emit();
  }

  onAdvancedSearch() {

    this.data.doSearch = true;
    this.dialogRef.close(this.data);

  }


}
