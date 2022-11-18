import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';
import { HelpInstructionsComponent } from './help-instructions/help-instructions.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SummaryComponent } from './summary/summary.component';
import { canActivate, emailVerified, AuthPipeGenerator } from '@angular/fire/auth-guard';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { map, pipe } from 'rxjs';

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
      return ['login'];
    }
  });

const redirectUnverifiedUser = () =>
  pipe(
    emailVerified,
    map(emailVerified => {
      if (emailVerified) {
        return true;
      } else {
        return ['verify-email-address'];
      }
    })
  );

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInUser) },
  { path: 'signup', component: SignUpComponent, ...canActivate(redirectLoggedInUser) },
  { path: 'verify-email-address', component: VerifyEmailComponent, ...canActivate(redirectUnauthorizedUser) },
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
  { path: '**', redirectTo: 'login' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }