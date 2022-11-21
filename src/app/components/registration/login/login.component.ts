import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(public authService: AuthenticationService,
    private toast: HotToastService) { }

  ngOnInit(): void {
    this.setForm();
  }

  setForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),
      password: new FormControl('', [Validators.required])
    });
  }

  errorHandling(control: string, error: string) {
    return this.loginForm.controls[control].hasError(error);
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.SignIn(this.loginForm.value.email, this.loginForm.value.password)
        .pipe(this.toast.observe({
          success: 'Logged in successfully!',
          loading: 'Logging in...',
          error: (message) => `${message}`
        })
          , catchError((error) => of(error)))
        .subscribe();
      // if (this.authService.isLoggedIn) {
      //   this.loginMessage(login);
      // }
      // else {
      //   this.verifyMessage(login);
      // }
    }
  }

  loginMessage(login: any) {
    login.pipe(this.toast.observe({
      success: 'Logged in successfully!',
      loading: 'Logging in...',
      error: (message) => `${message}`
    })
      , catchError((error) => of(error)))
      .subscribe();
  }

  // verifyMessage(login: any) {
  //   login.pipe(this.toast.observe({
  //     success: 'You are signed up but not verified! Please verify your email!',
  //     loading: 'Logging in...',
  //     error: (message) => `${message}`
  //   })
  //     , catchError((error) => of(error)))
  //     .subscribe();
  // }

  guestLogin() {
    this.authService.SignIn('guest@join.lukas-kolbe-dev.de', 'guest1234')
      .pipe(this.toast.observe({
        success: 'Logged in successfully',
        loading: 'Logging in...',
        error: (message) => `${message}`
      })
        , catchError((error) => of(error)))
      .subscribe();
  }
}