import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { catchError, of } from 'rxjs';
import { AuthenticationService } from '../../../services/authentication.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return {
        passwordDontMatch: true
      }
    }
    return null;
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(private authService: AuthenticationService,
    private toast: HotToastService,
    private router: Router) { }

  ngOnInit(): void {
    this.setForm();
  }

  setForm() {
    this.signUpForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      lastName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),
      phone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    },
      {
        validators: passwordsMatchValidator()
      });
  }

  signUp() {
    const { firstName, lastName, phone, email, password } = this.signUpForm.value;
    if (this.signUpForm.valid) {
      this.authService.SignUp(email, password)
        .pipe(this.toast.observe({
          success: 'You are now signed up. Please verify your email.',
          loading: 'Signing in...',
          error: (message) => `${message}`
        })
          , catchError((error) => of(error)))
        .subscribe();
    }
  }


  errorHandling(control: string, error: string) {
    return this.signUpForm.controls[control].hasError(error);
  }
}