import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss']
})
export class BoardCardComponent implements OnInit {
  @Input() card: any;
  contact$!: Observable<any>;
  assignedTo: any = [];

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.getContacts()
  }

  getContacts() {
    this.contact$ = this.firebaseService.getOneContact(this.card.assignedTo);
    this.contact$.subscribe((contact: any) => {
      this.assignedTo.push(contact);
      console.log(this.assignedTo);
    });
  }
}
