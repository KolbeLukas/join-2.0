import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;

  constructor(
    public firestoreService: FirebaseService,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public toast: HotToastService,
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user.uid;
        localStorage.setItem('user', JSON.stringify(this.userData));
        // JSON.parse(localStorage.getItem('user')!);
      }
      else {
        localStorage.setItem('user', 'null');
        // JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  logIn(email: string, password: string, remember: boolean) {
    if (!remember) {
      this.afAuth.setPersistence('session');
    }
    return from(
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then((result: any) => this.redirect(result)));
  }

  redirect(result: any) {
    this.updateUserData(result.user);
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.router.navigate(['/main']);
      }
    });
  }

  signUp(data: any) {
    this.afAuth.setPersistence('session');
    return from(this.afAuth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then((result) => {
        this.getData(result.user, data.firstName, data.lastName, data.phone, data.color);
        this.sendVerificationMail();
        this.setUserData(result.user);
      }))
  }

  getData(user: any, firstName: string, lastName: string, phone: string, color: string) {
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.color = color;
    return user;
  }

  sendVerificationMail() {
    return from(this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['registration/verify-email-address']);
      }));
  }

  forgotPassword(passwordResetEmail: string) {
    return from(this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.router.navigate(['registration/reset-password']);
      }))
  }

  showMessage(successMsg: any, loadingMsg: any) {
    return this.toast.observe({
      success: successMsg,
      loading: loadingMsg,
      error: (message) => `${message}`
    })
  }

  // get isLoggedIn(): boolean {
  //   const user = this.userData;
  //   return user !== null && user.emailVerified !== false ? true : false;
  // }

  updateUserData(result: any) {
    this.firestoreService.updateUser(result);
  }

  setUserData(user: any) {
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      emailVerified: user.emailVerified,
      color: user.color
    };
    this.firestoreService.createUser(userData, user.uid);
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/registration/login']);
    });
  }
}
