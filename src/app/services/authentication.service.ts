import { Injectable, NgZone } from '@angular/core';
import { User } from 'src/models/users.class';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public toast: HotToastService,
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        console.log(user)
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  SignIn(email: string, password: string) {
    return from(this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['/main']);
          }
        });
      }))
  }

  SignUp(email: string, password: string) {
    return from(this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SendVerificationMail();
        // this.SetUserData(result.user);
      }))
  }

  SendVerificationMail() {
    return from(this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['registration/verify-email-address']);
      }));
  }

  ForgotPassword(passwordResetEmail: string) {
    return from(this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.router.navigate(['registration/reset-password']);
      }));
  }

  // get isLoggedIn(): boolean {
  //   const user = this.userData;
  //   return user !== null && user.emailVerified !== false ? true : false;
  // }

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/registration/login']);
    });
  }
}
