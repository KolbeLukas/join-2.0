import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/registration/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SummaryComponent } from './components/main-content/summary/summary.component';
import { MainComponent } from './components/main-content/main-layout/main.component';
import { MenuComponent } from './components/main-content/menu/menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/main-content/header/header.component';
import { BoardComponent } from './components/main-content/board/board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BoardCardComponent } from './components/main-content/board-card/board-card.component';
import { AddTaskComponent } from './components/main-content/add-task/add-task.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ContactsComponent } from './components/main-content/contacts/contacts.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ContactsDetailComponent } from './components/main-content/contacts-detail/contacts-detail.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { BoardTaskDetailComponent } from './components/main-content/board-task-detail/board-task-detail.component';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AddContactComponent } from './components/main-content/add-contact/add-contact.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';
import { HelpInstructionsComponent } from './help-instructions/help-instructions.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { HotToastModule } from '@ngneat/hot-toast';
import { SignUpComponent } from './components/registration/sign-up/sign-up.component';
import { AuthenticationService } from './services/authentication.service';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { VerifyEmailComponent } from './components/registration/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './components/registration/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/registration/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SummaryComponent,
    MainComponent,
    MenuComponent,
    HeaderComponent,
    BoardComponent,
    BoardCardComponent,
    AddTaskComponent,
    ContactsComponent,
    ContactsDetailComponent,
    BoardTaskDetailComponent,
    AddContactComponent,
    LegalNoticeComponent,
    DataProtectionComponent,
    HelpInstructionsComponent,
    SignUpComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatToolbarModule,
    DragDropModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    TextFieldModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatListModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatRadioModule,
    MatDialogModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    HotToastModule.forRoot(
      {
        duration: 3000,
        position: 'bottom-center',
        style: {
          color: '#ffffff',
          background: '#323232'
        }
      }
    )
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
    AuthenticationService,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
