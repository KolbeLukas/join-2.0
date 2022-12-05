import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: any;

  constructor(private authService: AuthenticationService,
    private readonly firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    let userID = JSON.parse(localStorage.getItem('user')!);
    this.firebaseService.getOneUser(userID).subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser);
    });
  }

  logout() {
    this.authService.signOut();
  }
}