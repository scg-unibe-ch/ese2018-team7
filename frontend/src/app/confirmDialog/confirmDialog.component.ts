import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirmDialog.component.html',
  styleUrls: ['./confirmDialog.component.css']
})
/**
 * Component to display details of one Job
 */
export class ConfirmDialogComponent implements OnInit {

  // The Job
  @Input()
  msg: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.msg = this.data.msg;
  }

  ngOnInit(): void {
  }

  close(result: string) {
    this.dialogRef.close(result);
  }

}
