import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
import Clarity from '@microsoft/clarity';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [NavbarComponent, RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'Hello Russell';
  private firebaseService = inject(FirebaseService);

  constructor() {
    Clarity.init(environment.clarityProjectId);
    console.log('AppComponent constructor called');  
  }

  ngOnInit() {
    this.firebaseService.loadRatings();
  }

  setRating(rating: Number) {
    console.log('Rating: ' + rating);
    // set ID and rating
  }
}
