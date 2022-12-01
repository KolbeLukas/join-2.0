import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../services/authentication.service';
import { FirebaseService } from '../../../services/firebase.service';

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
  dayTime!: string;
  currentUser: any;

  constructor(private readonly firebaseService: FirebaseService,
    public authService: AuthenticationService) { }

  ngOnInit(): void {
    this.allTasks$ = this.firebaseService.getAllTasks();
    this.getData();
    this.getDayTime();
    this.getUser()
  }

  getUser() {
    let userID = JSON.parse(localStorage.getItem('user')!);
    this.firebaseService.getOneUser(userID).subscribe(user => {
      this.currentUser = user;
    });
  }

  getData() {
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

  getDayTime() {
    let today = new Date();
    let curHr = today.getHours();

    if (curHr < 12) {
      this.dayTime = 'Good morning';
    } else if (curHr < 18) {
      this.dayTime = 'Good afternoon'
    } else {
      this.dayTime = 'Good evening'
    }
  }
}