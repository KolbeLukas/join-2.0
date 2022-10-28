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

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.details)
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
  }

  stopProp(event: any) {
    event.stopPropagation();
  }
}
