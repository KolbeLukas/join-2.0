import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from '../../../services/authentication.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;

  constructor(public authService: AuthenticationService,
    private toast: HotToastService) { }

  ngOnInit(): void {
    this.setForm();
  }

  setForm() {
    this.forgotForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),
    })
  }

  send() {
    if (this.forgotForm.valid) {
      this.authService.ForgotPassword(this.forgotForm.value.email)
        .pipe(this.authService.showMessage('Email sended!', 'Sending...')
          , catchError((error) => of(error))
        )
        .subscribe();
    }
  }

  errorHandling(control: string, error: string) {
    return this.forgotForm.controls[control].hasError(error);
  }
}
