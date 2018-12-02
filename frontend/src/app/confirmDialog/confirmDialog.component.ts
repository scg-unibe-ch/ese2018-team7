import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

/**
 * Component to display a confirmation popup to the user
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirmDialog.component.html',
  styleUrls: ['./confirmDialog.component.css']
})

export class ConfirmDialogComponent implements OnInit {

  /**
   * Confirm message that should be displayed
   */
  @Input()
  msg: string;

  /**
   * Create a new instance of this component with the given parameters
   * @param dialogRef Reference to where this component was instanciated from
   * @param data Data containing the confirm message
   */
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.msg = this.data.msg;
  }

  /**
   * @ignore
   */
  ngOnInit(): void {
  }

  /**
   * Close the confirm popup after an action was taken
   * @param result Action that the user chose
   */
  close(result: string) {
    this.dialogRef.close(result);
  }

}
