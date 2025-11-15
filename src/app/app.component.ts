import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [NavbarComponent, RouterOutlet],
})
export class AppComponent {
  title = 'Hello Russell';

  setRating(rating: Number) {
    console.log('Rating: ' + rating);
    // set ID and rating
  }
}
