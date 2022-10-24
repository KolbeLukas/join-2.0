import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  newTask!: FormGroup
  newCategory = false;
  minDate = new Date;

  constructor(private dateAdapter: DateAdapter<any>,
    private firebaseService: FirebaseService,
    private _ngZone: NgZone) { }

  ngOnInit(): void {
    this.setForm();
    this.dateAdapter.setLocale('de');
  }

  setForm() {
    this.newTask = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      categoryColor: new FormControl(''),
      contact: new FormControl('', [Validators.required]),
      dueDate: new FormControl('', [Validators.required]),
      prio: new FormControl('', [Validators.required]),
    });
  }

  createTask() {
    if (this.newTask.valid) {
      this.newTask.value.dueDate = this.changeDateAppearance(this.newTask.value.dueDate._d);
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
    console.log(this.newCategory)
  }

  closeNewCategory() {
    this.newCategory = false;
    this.newTask.controls['category'].reset();
    console.log(this.newCategory)
  }

  clearForm() {
    this.newCategory = false;
    this.formDirective.resetForm();
  }
}
