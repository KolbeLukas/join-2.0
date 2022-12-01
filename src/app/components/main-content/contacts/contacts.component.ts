import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  allContacts$!: Observable<any>;
  alphabet: any = []
  sortedContacts: any = [];
  selectedContact: any;
  selectedBG: any;
  showDetails = false;

  constructor(private readonly firebaseService: FirebaseService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.allContacts$ = this.firebaseService.getAllContacts();
    this.allContacts$.subscribe(allContacts => {
      this.sortByFirstName(allContacts);
      this.sortByLastName();
    });
  }

  sortByFirstName(allContacts: any) {
    this.alphabet = [];
    this.sortedContacts = [];
    allContacts.forEach((contact: any) => {
      this.filterByFirstLetter(contact);
    });
  }

  filterByFirstLetter(contact: any) {
    let letter = contact.firstName.charAt(0).toUpperCase();
    if (this.alphabet.includes(letter)) {
      let index = this.alphabet.findIndex((element: any) => element == letter);
      this.sortedContacts[index].push(contact);
    } else {
      this.alphabet.push(letter);
      this.sortedContacts.push([contact]);
    }
  }

  sortByLastName() {
    this.sortedContacts.forEach((contact: any) => {
      contact.sort(function (a: { lastName: string; }, b: { lastName: string; }) {
        let nameA = a.lastName.toUpperCase();
        let nameB = b.lastName.toUpperCase();
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
      });
    });
  }

  addContactDialog(): void {
    const dialogRef = this.dialog.open(AddContactComponent, {
      width: '100%',
    });
    dialogRef.componentInstance.openedAsDialogNewContact = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedContact = result;
        this.selectedBG = result.firstName + result.lastName + result.email + result.phone;
      }
    });
  }

  showNewData(result: any) {
    if (result == 'deleted') {
      this.selectedContact = undefined;
      this.selectedBG = undefined;
      this.showDetails = false;
    } else {
      this.selectedBG = result.id;
    }
  }

  openContact(contact: any) {
    this.showDetails = true;
    this.selectedContact = contact;
    this.selectedBG = contact.id;
  }
}