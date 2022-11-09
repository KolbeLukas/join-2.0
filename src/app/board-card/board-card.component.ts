import { Component, OnInit, Input } from '@angular/core';
import { Observable, take } from 'rxjs';
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
    // this.getContacts();
  }

  // getContacts() {
  //   this.card.assignedTo.forEach((contact: string) => {
  //     this.contact$ = this.firebaseService.getOneContact(contact);
  //     this.contact$
  //       // .pipe(take(1))
  //       .subscribe((contact: any) => {
  //         this.assignedTo.push(contact);
  //       });
  //   });
  // }
}
