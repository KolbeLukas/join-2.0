import { Component, OnInit, Injector, Input, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { Contact } from 'src/models/contact.class';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {
  dialogRef?: MatDialogRef<AddContactComponent>
  newContact!: FormGroup;
  @Input() openedAsDialogNewContact: boolean = false;
  @Input() openedAsDialogEditContact: boolean = false;
  color = '#';
  contact = new Contact();
  deleteOverlay = false;

  constructor(private firebaseService: FirebaseService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private injector: Injector,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.checkOpenNewContact();
    this.checkOpenEditContact();
    this.dialogRef = <MatDialogRef<AddContactComponent>>(
      this.injector.get(MatDialogRef));
    this.setForm();
  }

  checkOpenNewContact() {
    if (this.openedAsDialogNewContact) {
      this.dialogRef = <MatDialogRef<AddContactComponent>>(
        this.injector.get(MatDialogRef));
    }
  }

  checkOpenEditContact() {
    if (this.openedAsDialogEditContact) {
      this.contact = this.data.contact;
      if (this.contact.id) {
        return;
      } else {
        this.getID();
      }
    }
  }

  setForm() {
    this.newContact = new FormGroup({
      firstName: new FormControl(this.contact.firstName, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      lastName: new FormControl(this.contact.lastName, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      email: new FormControl(this.contact.email, [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),
      phone: new FormControl(this.contact.phone, [Validators.required, Validators.pattern('[- +()0-9]+')])
    });
  }

  errorHandling(control: string, error: string) {
    return this.newContact.controls[control].hasError(error);
  }

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    this.color = '#';
    for (var i = 0; i < 6; i++) {
      this.color += letters[Math.floor(Math.random() * 16)];
    }
  }

  createContact() {
    if (this.newContact.valid) {
      this.lowercase();
      if (this.openedAsDialogNewContact) {
        this.addNewContact()
      }
      if (this.openedAsDialogEditContact) {
        this.updateContact()
      }
      this.closeDialog('save');
    }
  }

  addNewContact() {
    this.getRandomColor();
    this.newContact.value.color = this.color;
    this.newContact.value.addDate = new Date();
    this.firebaseService.createContact(this.newContact.value);
    this.openSnackBar('Contact has been created.');
  }

  updateContact() {
    this.newContact.value.color = this.contact.color;
    this.newContact.value.id = this.contact.id;
    this.firebaseService.updateContact(this.newContact.value);
    this.resetTasks();
    this.openSnackBar('Contact has been updated.');
  }

  resetTasks() {
    let allTasks$ = this.firebaseService.getAllTasks();
    allTasks$.pipe(take(1)).subscribe(tasks => {
      tasks.forEach((task: any) => {
        task.contacts = [];
        this.firebaseService.updateTask(task)
      })
    })
  }

  getID() {
    let latestContact = this.firebaseService.findContactID();
    latestContact.pipe(take(1)).subscribe(id => {
      this.contact.id = id[0].id;
    });
  }

  lowercase() {
    this.newContact.value.firstName = this.newContact.value.firstName.toLowerCase();
    this.newContact.value.lastName = this.newContact.value.lastName.toLowerCase();
  }

  closeDialog(input: any) {
    if (input == 'save') {
      this.dialogRef?.close(this.newContact.value);
    }
    if (input == 'cancel') {
      this.dialogRef?.close();
    }
    if (input == 'deleted') {
      this.dialogRef?.close(input)
    }
  }

  openSnackBar(message: any) {
    this._snackBar.open(message);
  }

  openDeleteOverlay() {
    this.deleteOverlay = true;
  }

  closeDeleteOverlay() {
    this.deleteOverlay = false;
  }

  deleteContact() {
    this.firebaseService.deleteContact(this.contact.id);
    this.closeDialog('deleted');
    this.openSnackBar('Contact permanently deleted.');
  }

  stopProp(event: any) {
    event.stopPropagation();
  }
}
