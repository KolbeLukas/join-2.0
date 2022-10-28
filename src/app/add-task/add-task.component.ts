import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild, Inject, Input, Optional, Injector } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { DateAdapter } from '@angular/material/core';
import { Task } from 'src/models/task.class';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})

export class AddTaskComponent implements OnInit {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  @Input() openedAsDialogNewTask: boolean = false;
  @Input() openedAsDialogEditTask: boolean = false;
  dialogRef?: MatDialogRef<AddTaskComponent>
  newTask!: FormGroup;
  task = new Task();
  newCategory = false;
  minDate = new Date;
  state = 'todo';

  constructor(private dateAdapter: DateAdapter<any>,
    private firebaseService: FirebaseService,
    private _ngZone: NgZone,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private injector: Injector) { }

  ngOnInit(): void {
    this.checkOpenNewTask();
    this.checkOpenEditTask();
    this.setForm();
    this.dateAdapter.setLocale('de');
  }

  checkOpenNewTask() {
    if (this.openedAsDialogNewTask) {
      this.state = this.data.state;
      this.dialogRef = <MatDialogRef<AddTaskComponent>>(
        this.injector.get(MatDialogRef));
    }
  }

  checkOpenEditTask() {
    if (this.openedAsDialogEditTask) {
      this.task = this.data.task;
      this.state = this.data.task.state;
      this.dialogRef = <MatDialogRef<AddTaskComponent>>(
        this.injector.get(MatDialogRef));
    }
  }



  setForm() {
    this.newTask = new FormGroup({
      title: new FormControl(this.task.title, [Validators.required]),
      description: new FormControl(this.task.description, [Validators.required]),
      category: new FormControl(this.task.category, [Validators.required]),
      categoryColor: new FormControl(this.task.categoryColor, [Validators.required]),
      assignedTo: new FormControl(this.task.assignedTo, [Validators.required]),
      dueDate: new FormControl(new Date(this.task.dueDate.date), [Validators.required]),
      prio: new FormControl(this.task.prio, [Validators.required]),
    });
  }

  createTask(state: string) {
    if (this.newTask.valid) {
      this.setDate();
      this.newTask.value.state = state;
      if (this.openedAsDialogEditTask) {
        this.newTask.value.id = this.task.id;
        this.firebaseService.updateTask(this.newTask.value);
      } else {
        this.firebaseService.createTask(this.newTask.value);
      }
      this.clearForm();
      this.closeDialog();
    }
  }

  setDate() {
    let date = this.newTask.value.dueDate
    this.newTask.value.dueDate = {};
    if (this.openedAsDialogEditTask) {
      this.editDueDate(date);
    } else {
      this.newTask.value.dueDate.date = date._d.toDateString();
      this.newTask.value.dueDate.timestamp = date._d;
    }
  }

  editDueDate(date: any) {
    if (typeof date._d == 'undefined') {
      this.newTask.value.dueDate.date = date.toDateString();
      this.newTask.value.dueDate.timestamp = date;
    } else {
      this.newTask.value.dueDate.date = date._d.toDateString();
      this.newTask.value.dueDate.timestamp = date._d;
    }
  }

  errorHandling(control: string, error: string) {
    return this.newTask.controls[control].hasError(error);
  }

  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  createNewCategory() {
    this.newCategory = true;
    this.newTask.controls['category'].reset();
    this.newTask.controls['categoryColor'].reset();
    console.log(this.newTask.controls['categoryColor'].hasError('required'))
  }

  closeNewCategory() {
    this.newCategory = false;
    this.newTask.controls['category'].reset();
  }

  clearForm() {
    this.newCategory = false;
    this.formDirective.resetForm();
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
