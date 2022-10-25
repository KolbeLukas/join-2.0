import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { DateAdapter } from '@angular/material/core';
import { Task } from 'src/models/task.class';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  newTask!: FormGroup;
  task = new Task();
  newCategory = false;
  minDate = new Date;

  constructor(private dateAdapter: DateAdapter<any>,
    private firebaseService: FirebaseService,
    private _ngZone: NgZone) { }

  ngOnInit(): void {
    this.setForm();
    this.dateAdapter.setLocale('de');
    console.log(this.newTask.controls['category'].hasError('required'))
  }

  setForm() {
    this.newTask = new FormGroup({
      title: new FormControl(this.task.title, [Validators.required]),
      description: new FormControl(this.task.description, [Validators.required]),
      category: new FormControl(this.task.category, [Validators.required]),
      categoryColor: new FormControl(this.task.categoryColor, [Validators.required]),
      assignedTo: new FormControl(this.task.assignedTo, [Validators.required]),
      dueDate: new FormControl(this.task.dueDate, [Validators.required]),
      prio: new FormControl(this.task.prio, [Validators.required]),
    });
  }

  createTask() {
    if (this.newTask.valid) {
      this.newTask.value.dueDate = this.changeDateAppearance(this.newTask.value.dueDate._d);
      this.newTask.value.state = 'todo';
      this.firebaseService.createTask(this.newTask.value);
      this.clearForm();
    }
  }

  changeDateAppearance(date: any) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return day + '.' + month + '.' + year;
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
}
