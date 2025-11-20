import { Component, OnInit, inject } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { FormsModule } from '@angular/forms';
import { StatsComponent } from '../stats/stats.component';
import { LoginComponent } from '../login/login.component';

@Component({
    selector: 'app-settings',
    standalone: true,
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    imports: [
        FormsModule,
        StatsComponent,
        LoginComponent,
    ]
})
export class SettingsComponent implements OnInit {
  // Injected dependencies
  private alertService = inject(AlertService);

  // Public properties
  public bearerToken: string | null;

  constructor() {
    this.bearerToken = localStorage.getItem('bearerToken');
  }

  ngOnInit() {
  }

  setBearerToken() {
    if (this.bearerToken) localStorage.setItem('bearerToken', this.bearerToken);
    console.log('Updated local storage.' + this.bearerToken);
  }

  clearRatings() {
    if (confirm("Are you sure you want to clear the ratings?")) {
      localStorage.removeItem('ratings');
      this.alertService.success('Cleared ratings');
    }
  }

  setRatingSystem(ratingSystem: string) {
    console.log(ratingSystem);
    localStorage.setItem('ratingSystem', ratingSystem);
  }
}
