import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-contacts-detail',
  templateUrl: './contacts-detail.component.html',
  styleUrls: ['./contacts-detail.component.scss']
})
export class ContactsDetailComponent implements OnInit {
  @Input() contact: any;
  @Output() newData = new EventEmitter<any>();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  editContact(contact: any) {
    const dialogRef = this.dialog.open(AddContactComponent, {
      width: '100%',
      data: {
        contact
      }
    });
    dialogRef.componentInstance.openedAsDialogEditContact = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newData.emit(result);
        this.contact = result;
      }
    });
  }

  addTaskDialog(contact: any) {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '100%',
      data: {
        data: [contact.id]
      },
    });
    dialogRef.componentInstance.openedAsDialogNewTaskContact = true;
  }
}