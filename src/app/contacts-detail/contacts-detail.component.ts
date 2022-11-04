import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-contacts-detail',
  templateUrl: './contacts-detail.component.html',
  styleUrls: ['./contacts-detail.component.scss']
})
export class ContactsDetailComponent implements OnInit {
  @Input() contact: any;

  constructor() { }

  ngOnInit(): void {
  }

}
