import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from '../authentication.service';

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
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9]+@[a-z0-9]+\\.[a-z]{2,4}$')]),
      phone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    },
      {
        validators: passwordsMatchValidator()
      });
  }

  signup() {
    if (this.signUpForm.valid) {
      const { name, email, password } = this.signUpForm.value;
      this.authService.signUp(name, email, password)
        .pipe(this.toast.observe({
          success: 'Your are now signed up',
          loading: 'Signing in...',
          error: (message) => `${message}`
        }))
        .subscribe(() => {
          this.router.navigate(['/main']);
        })
    }

  }

  errorHandling(control: string, error: string) {
    return this.signUpForm.controls[control].hasError(error);
  }
}