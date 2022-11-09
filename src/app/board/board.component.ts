import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { AddTaskComponent } from '../add-task/add-task.component';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  allTasks$!: Observable<any>;
  overlayOpen = false;
  details: any;
  todos: string[] = [];
  inProgress: string[] = [];
  feedback: string[] = [];
  done: string[] = [];

  constructor(private readonly firebaseService: FirebaseService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.allTasks$ = this.firebaseService.getAllTasks();
    this.allTasks$.subscribe(allTasks => {
      this.clear();
      allTasks.forEach((task: any) => {
        this.sortByState(task);
        if (task.contacts === undefined || task.contacts.length == 0) {
          task.assignedTo.forEach((contact: string) => {
            let one = this.firebaseService.getOneContact(contact);
            task.contacts = [];
            one.pipe(take(1)).subscribe((contact: any) => {
              task.contacts.push(contact);
              this.firebaseService.updateTask(task)
            });
          });
        }
        // if (task.assignedTo[0].firstName == undefined) {
        //   let assignedTo = task.assignedTo;
        //   task.assignedTo = [];
        //   assignedTo.forEach((contact: any) => {
        //     let one = this.firebaseService.getOneContact(contact);
        //     one.pipe(take(1)).subscribe((contact: any) => {
        //       task.assignedTo.push(contact);
        //     });
        //   })
        // }
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
      this.todos.push(task);
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

  addTaskDialog(state: string) {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '100%',
      panelClass: 'custom-addTask-container',
      data: {
        state: state
      },
    });
    dialogRef.componentInstance.openedAsDialogNewTask = true;
  }

  openOverlay(taskData: any) {
    this.overlayOpen = true;
    this.details = taskData;
  }

  closeOverlay() {
    this.overlayOpen = false;
  }
}