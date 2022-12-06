import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './components/main-content/add-task/add-task.component';
import { BoardComponent } from './components/main-content/board/board.component';
import { ContactsComponent } from './components/main-content/contacts/contacts.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';
import { HelpInstructionsComponent } from './help-instructions/help-instructions.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { LoginComponent } from './components/registration/login/login.component';
import { MainComponent } from './components/main-content/main-layout/main.component';
import { SignUpComponent } from './components/registration/sign-up/sign-up.component';
import { SummaryComponent } from './components/main-content/summary/summary.component';
import { canActivate, emailVerified, AuthPipeGenerator } from '@angular/fire/auth-guard';
import { VerifyEmailComponent } from './components/registration/verify-email/verify-email.component';
import { map, pipe } from 'rxjs';
import { ForgotPasswordComponent } from './components/registration/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/registration/reset-password/reset-password.component';

const redirectLoggedInUser: AuthPipeGenerator = () =>
  map(user => {
    if (user) {
      if (!user.emailVerified) {
        return true;
      } else {
        return ['main'];
      }
    } else {
      return true;
    }
  });

const redirectUnauthorizedUser: AuthPipeGenerator = () =>
  map(user => {
    if (user !== null) {
      if (!user.emailVerified) {
        return true;
      } else {
        return ['main'];
      }
    }
    else {
      return ['registration'];
    }
  });

const redirectUnverifiedUser = () =>
  pipe(
    emailVerified,
    map(emailVerified => {
      if (emailVerified) {
        return true;
      } else {
        return ['/registration/verify-email-address'];
      }
    })
  );

const routes: Routes = [
  { path: '', redirectTo: 'registration', pathMatch: 'full' },
  {
    path: 'registration', ...canActivate(redirectLoggedInUser),
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignUpComponent },
      { path: 'verify-email-address', component: VerifyEmailComponent, ...canActivate(redirectUnauthorizedUser) },
      { path: 'forgotpassword', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: '**', redirectTo: 'login' }
    ]
  },
  {
    path: 'main', component: MainComponent, ...canActivate(redirectUnverifiedUser),
    children: [
      { path: 'summary', component: SummaryComponent },
      { path: 'board', component: BoardComponent },
      { path: 'addtask', component: AddTaskComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'legalnotice', component: LegalNoticeComponent },
      { path: 'dataprotection', component: DataProtectionComponent },
      { path: 'help', component: HelpInstructionsComponent },
      { path: '**', redirectTo: 'summary' }
    ]
  },
  { path: '**', redirectTo: 'main' },
  { path: '**', redirectTo: 'registration' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }