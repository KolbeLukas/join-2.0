import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  checked = false;
  hidePw = true;

  constructor(public authService: AuthenticationService) { }

  ngOnInit(): void {
    this.setForm();
  }

  setForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl('')
    });
  }

  errorHandling(control: string, error: string) {
    return this.loginForm.controls[control].hasError(error);
  }

  login() {
    const { email, password, remember } = this.loginForm.value;
    if (this.loginForm.valid) {
      this.authService.logIn(email, password, remember)
        .pipe(this.authService.showMessage('Logged in successfully!', 'Logging in...')
          , catchError((error) => of(error)))
        .subscribe();
    }
  }

  guestLogin() {
    this.authService.logIn('guest@join.lukas-kolbe-dev.de', 'guest1234', this.loginForm.value.remember)
      .pipe(this.authService.showMessage('Logged in successfully!', 'Logging in...')
        , catchError((error) => of(error)))
      .subscribe();
  }
}