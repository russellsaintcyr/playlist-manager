import { Component, OnInit, inject } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { FirebaseService } from '../../services/firebase.service';
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
  private firebaseService = inject(FirebaseService);

  // Public properties
  public bearerToken: string | null;
  public isSavingToFirebase = false;
  public isLoadingFromFirebase = false;

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

  async saveRatingsToFirebase() {
    try {
      this.isSavingToFirebase = true;
      
      // Get ratings from localStorage
      const ratingsJson = localStorage.getItem('ratings');
      if (!ratingsJson) {
        this.alertService.info('No ratings found in local storage');
        this.isSavingToFirebase = false;
        return;
      }

      const ratings = JSON.parse(ratingsJson);
      await this.firebaseService.saveRatings(ratings);
      this.alertService.success(`Successfully saved ${ratings.length} ratings to Firebase!`);
    } catch (error: any) {
      console.error('Error saving ratings:', error);
      this.alertService.error(`Failed to save ratings: ${error.message}`);
    } finally {
      this.isSavingToFirebase = false;
    }
  }

  async loadRatingsFromFirebase() {
    try {
      this.isLoadingFromFirebase = true;
      
      const ratings = await this.firebaseService.getRatings();
      if (ratings.length === 0) {
        this.alertService.info('No ratings found in Firebase');
        this.isLoadingFromFirebase = false;
        return;
      }

      // Save loaded ratings to localStorage
      localStorage.setItem('ratings', JSON.stringify(ratings));
      this.alertService.success(`Successfully loaded ${ratings.length} ratings from Firebase!`);
    } catch (error: any) {
      console.error('Error loading ratings:', error);
      this.alertService.error(`Failed to load ratings: ${error.message}`);
    } finally {
      this.isLoadingFromFirebase = false;
    }
  }
}
