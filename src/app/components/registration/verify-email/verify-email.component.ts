import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { catchError, of } from 'rxjs';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  disabled = true;
  timer = 60;

  constructor(public authService: AuthenticationService,
    private toast: HotToastService) { }

  ngOnInit(): void {
    this.enableButton();
    this.enableTimer();
  }

  resend() {
    this.disabled = true;
    this.timer = 60;
    this.authService.SendVerificationMail()
      .pipe(this.authService.showMessage('Email sended!', 'Sending...')
        , catchError(
          (error) => of(error)
        ))
      .subscribe();
  }

  enableTimer() {
    setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      }
    }, 1000);
  }

  enableButton() {
    setTimeout(() => {
      this.disabled = false;
    }, 60000);
  }
}