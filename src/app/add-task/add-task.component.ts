import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild, Inject, Input, Optional, Injector } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { DateAdapter } from '@angular/material/core';
import { Task } from 'src/models/task.class';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoardComponent } from '../board/board.component';

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
  @Input() openedAsDialogNewTaskContact: boolean = false;
  dialogRef?: MatDialogRef<AddTaskComponent>
  newTask!: FormGroup;
  task = new Task();
  newCategory = false;
  minDate = new Date;
  state = 'todo';
  deleteOverlay = false;
  contacts$!: Observable<any>;

  constructor(private dateAdapter: DateAdapter<any>,
    private firebaseService: FirebaseService,
    private _ngZone: NgZone,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private injector: Injector,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.checkOpenNewTask();
    this.checkOpenEditTask();
    this.checkOpenNewTaskContact()
    this.getContacts();
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

  // contacts: any[] = [];

  checkOpenEditTask() {
    if (this.openedAsDialogEditTask) {
      this.task = this.data.task;
      this.state = this.data.task.state;
      // let assignedTo = this.task.assignedTo;
      // this.task.assignedTo = [];
      // assignedTo.forEach((contact: { id: any; }) => {
      //   console.log(contact.id)
      //   this.task.assignedTo.push(contact.id)
      // })
      // let contacts: any[] = [];
      // this.task.contacts.forEach((element: { id: any; }) => {
      //   this.contacts.push(element.id)
      // });
      // this.task.assignedTo = this.contacts;
      this.dialogRef = <MatDialogRef<AddTaskComponent>>(
        this.injector.get(MatDialogRef));
    }
  }

  checkOpenNewTaskContact() {
    if (this.openedAsDialogNewTaskContact) {
      this.task.assignedTo = this.data.data;
      this.dialogRef = <MatDialogRef<AddTaskComponent>>(
        this.injector.get(MatDialogRef));
    }
  }

  getContacts() {
    this.contacts$ = this.firebaseService.getAllContacts();
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
      this.checkOpenAs();
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

  checkOpenAs() {
    if (this.openedAsDialogEditTask) {
      this.newTask.value.id = this.task.id;
      this.newTask.value.contacts = [];
      this.firebaseService.updateTask(this.newTask.value);
      this.openSnackBar('Task has been updated.');
    } else {
      this.firebaseService.createTask(this.newTask.value);
      this.openSnackBar('New task created.');
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
    this.dialogRef?.close();
  }

  openDeleteOverlay() {
    this.deleteOverlay = true;
  }

  closeDeleteOverlay() {
    this.deleteOverlay = false;
  }

  deleteTask() {
    this.firebaseService.deleteTask(this.task.id);
    this.closeDialog();
    this.openSnackBar('Task permanently deleted.');
  }

  openSnackBar(message: any) {
    this._snackBar.open(message);
  }

  stopProp(event: any) {
    event.stopPropagation();
  }
}