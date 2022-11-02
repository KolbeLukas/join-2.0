import { Component, OnInit, Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {
  dialogRef?: MatDialogRef<AddContactComponent>

  constructor(private injector: Injector) { }

  ngOnInit(): void {
    this.dialogRef = <MatDialogRef<AddContactComponent>>(
      this.injector.get(MatDialogRef));
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
