import { Component, OnInit, inject } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AppSettings } from '../../../appSettings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  // Injected dependencies
  private alertService = inject(AlertService);

  // Public properties
  public ratingSystem = 'THUMBS';
  public bearerToken: string | null;

  constructor() {
    this.bearerToken = localStorage.getItem('bearerToken');
  }

  ngOnInit() {
    // console.log(localStorage.getItem('ratingSystem'));
    // this.ratingSystem = (localStorage.getItem('ratingSystem') !== null) ? localStorage.getItem('ratingSystem') : AppSettings.RATING_SYSTEMS.STARS5;
  }

  setBearerToken() {
    if (this.bearerToken) localStorage.setItem('bearerToken', this.bearerToken);
    console.log('Updated local storage.' + this.bearerToken);
  }

  clearRatings() {
    localStorage.removeItem('ratings');
    this.alertService.success('Cleared ratings');
  }

  setRatingSystem(ratingSystem: string) {
    console.log(ratingSystem);
    localStorage.setItem('ratingSystem', ratingSystem);
  }
}
