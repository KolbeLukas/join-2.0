import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  data$!: Observable<any>;
  card: any;
  todos: string[] = [];
  inProgress: string[] = [];
  feedback: string[] = [];
  done: string[] = [];

  constructor(private readonly firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.data$ = this.firebaseService.getAllTasks();
    this.data$.subscribe(data => {
      this.clear();
      data.forEach((task: any) => {
        this.sortByState(task);
      });
    });
  }

  clear() {
    this.todos = [];
    this.inProgress = [];
    this.feedback = [];
    this.done = [];
  }

  sortByState(task: any) {
    if (task.state == 'todo') {
      this.todos.push(task)
    };
    if (task.state == 'inProgress') {
      this.inProgress.push(task);
    };
    if (task.state == 'feedback') {
      this.feedback.push(task);
    };
    if (task.state == 'done') {
      this.done.push(task);
    };
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
    this.updateTaskState(event.item.data, event.container.id);
  }

  updateTaskState(task: any, state: any) {
    task.state = state;
    this.firebaseService.updateTask(task);
  }
}
