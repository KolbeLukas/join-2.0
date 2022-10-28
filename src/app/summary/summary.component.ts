import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  allTasks$!: Observable<any>;
  todos!: number;
  inProgress!: number;
  feedback!: number;
  done!: number;
  urgent!: number;
  deadline!: string;

  constructor(private readonly firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.allTasks$ = this.firebaseService.getAllTasks();
    this.allTasks$.subscribe(allTasks => {
      this.clear();
      allTasks.forEach((task: any, index: any) => {
        this.count(task);
        this.getLowestDueDate(task, index);
      });
    });
  }

  getLowestDueDate(task: any, index: any) {
    if (index == 0) {
      this.deadline = this.changeDateAppearance(new Date(task.dueDate.date));
    }
  }

  changeDateAppearance(date: any) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let day = date.getDate();
    let month = date.getMonth();
    month = months[month];
    let year = date.getFullYear();
    return month + ' ' + day + ', ' + year;
  }

  clear() {
    this.todos = 0;
    this.inProgress = 0;
    this.feedback = 0;
    this.done = 0;
    this.urgent = 0;
  }

  count(task: any) {
    if (task.state == 'todo') {
      this.todos++;
    };
    if (task.state == 'inProgress') {
      this.inProgress++;
    };
    if (task.state == 'feedback') {
      this.feedback++;
    };
    if (task.state == 'done') {
      this.done++;
    };
    if (task.prio == 'urgent') {
      this.urgent++;
    }
  }
}
