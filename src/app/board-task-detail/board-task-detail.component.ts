import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-board-task-detail',
  templateUrl: './board-task-detail.component.html',
  styleUrls: ['./board-task-detail.component.scss']
})
export class BoardTaskDetailComponent implements OnInit {
  @Input() details: any;
  @Output() close = new EventEmitter<boolean>();
  dueDate: any;
  open = false;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.changeDateAppearance();
    setTimeout(() => {
      this.open = true;
    }, 60);
    // this.open = true;
  }

  changeDateAppearance() {
    let date = new Date(this.details.dueDate.date);
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    this.dueDate = day + '.' + month + '.' + year;
  }

  openTask(task: any) {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '100%',
      data: {
        task
      },
    });
    dialogRef.componentInstance.openedAsDialogEditTask = true;
    this.closeOverlay();
  }

  closeOverlay() {
    this.close.emit();
    this.open = false;
  }

  stopProp(event: any) {
    event.stopPropagation();
  }
}
