import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  imports: [MatDialogModule, MatButtonModule],
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirm</h2>

    <mat-dialog-content>
      <p>Are you sure you want to delete this record?</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button type="button" (click)="onNoClick()">Cancel</button>
      <button mat-flat-button type="button" [mat-dialog-close]="true" cdkFocusInitial>Delete</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {

  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onNoClick() {
    this.dialogRef.close(false);
  }
}
