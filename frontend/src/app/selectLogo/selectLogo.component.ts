import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-select-logo',
  templateUrl: './selectLogo.component.html',
  styleUrls: ['./selectLogo.component.css']
})

/**
 * Component to display all approved Jobs
 */
export class SelectLogoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SelectLogoComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onSelectLogo(value: string) {
    this.dialogRef.close(value);
  }

}
