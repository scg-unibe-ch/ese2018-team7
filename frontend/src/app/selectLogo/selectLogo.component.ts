import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

/**
 * Component to display the logo selection dialog window to the user
 */
@Component({
  selector: 'app-select-logo',
  templateUrl: './selectLogo.component.html',
  styleUrls: ['./selectLogo.component.css']
})

export class SelectLogoComponent implements OnInit {

  /**
   * @ignore
   */
  constructor(public dialogRef: MatDialogRef<SelectLogoComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  /**
   * @ignore
   */
  ngOnInit() {
  }

  /**
   * Close the dialog window, if the user has clicked on a logo
   * @param logo Logo that has been chosen
   */
  onSelectLogo(logo: string) {
    this.dialogRef.close(logo);
  }

}
