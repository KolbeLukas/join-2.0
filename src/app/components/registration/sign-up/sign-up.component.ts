import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  hidePw = true;
  hideConPw = true;
  color = '#'

  constructor(private authService: AuthenticationService) { }

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

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    this.color = '#';
    for (var i = 0; i < 6; i++) {
      this.color += letters[Math.floor(Math.random() * 16)];
    }
  }

  signUp() {
    if (this.signUpForm.valid) {
      this.getRandomColor();
      this.signUpForm.value.color = this.color;
      this.authService.signUp(this.signUpForm.value)
        .pipe(this.authService.showMessage('You are now signed up. Please verify your email.', 'Signing in...')
          , catchError(
            (error) => of(error)
          ))
        .subscribe();
    }
  }



  errorHandling(control: string, error: string) {
    return this.signUpForm.controls[control].hasError(error);
  }
}