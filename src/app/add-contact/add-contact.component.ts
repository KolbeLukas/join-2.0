import { Component, OnInit, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {
  dialogRef?: MatDialogRef<AddContactComponent>
  newContact!: FormGroup;

  constructor(private firebaseService: FirebaseService,
    private injector: Injector) { }

  ngOnInit(): void {
    this.dialogRef = <MatDialogRef<AddContactComponent>>(
      this.injector.get(MatDialogRef));
    this.setForm()
  }

  setForm() {
    this.newContact = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      phone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')])
    });
  }

  errorHandling(control: string, error: string) {
    return this.newContact.controls[control].hasError(error);
  }

  createContact() {
    if (this.newContact.valid) {
      console.log(this.newContact.value)
      this.firebaseService.createContact(this.newContact.value);
      this.closeDialog();
    }
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
