import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { HotToastService } from '@ngneat/hot-toast';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService) { }

  ngOnInit(): void {
    this.setForm();
  }

  setForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9]+@[a-z0-9]+\\.[a-z]{2,4}$')]),
      password: new FormControl('', [Validators.required])
    });
  }

  errorHandling(control: string, error: string) {
    return this.loginForm.controls[control].hasError(error);
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .pipe(this.toast.observe({
          success: 'Logged in successfully',
          loading: 'Logging in...',
          error: (message) => `${message}`
        })
          , catchError(
            (error) => of(error)
          ))
        .subscribe(() => {
          this.router.navigate(['/main']);
        });
    }
  }

  guestLogin() {
    this.authService.login('guest@mail.de', 'guest1234').pipe(
      this.toast.observe({
        success: 'Logged in successfully',
        loading: 'Logging in...',
        error: (message) => `${message}`
      })
    ).subscribe(() => {
      this.router.navigate(['/main']);
    });
  }
}