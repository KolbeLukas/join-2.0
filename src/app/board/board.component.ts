import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  card: any;
  todos = [{
    category: 'todo',
    title: 'todo',
    description: 'This card has divider and indeterminate progress as footer',
    assignedTo: ['SW', 'AB', 'WB'],
    prio: '/assets/img/icon/prio_low.png'
  },
  ];
  inProgress = [{
    category: 'in progress',
    title: 'in progress',
    description: 'This card has divider and indeterminate progress as footer',
    assignedTo: ['SW', 'AB', 'WB'],
    prio: '/assets/img/icon/prio_medium.png'
  }];
  feedback = [{
    category: 'feedback',
    title: 'feedback',
    description: 'This card has divider and indeterminate progress as footer',
    assignedTo: ['SW', 'AB', 'WB'],
    prio: '/assets/img/icon/prio_urgent.png'
  }];
  done = [{
    category: 'done',
    title: 'done',
    description: 'This card has divider and indeterminate progress as footer',
    assignedTo: ['SW', 'AB', 'WB'],
    prio: '/assets/img/icon/prio_low.png'
  }];

  constructor() { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
