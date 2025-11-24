import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyButtonComponent } from '../my-button/my-button.component';
import { Track } from '../../classes/track';
import { Rating } from '../../classes/rating';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-ratings-buttons',
  templateUrl: './ratings-buttons.component.html',
  styleUrls: ['./ratings-buttons.component.css'],
  imports: [CommonModule, MyButtonComponent]
})
export class RatingsButtonsComponent implements OnInit {
  @Input() track!: Track;
  @Input() selectedPlaylist: any;
  
  private firebaseService = inject(FirebaseService);
  private ratings: Array<Rating> = [];

  ngOnInit() {
    // Load ratings from localStorage
    const storedRatings = localStorage.getItem('ratings');
    if (storedRatings) {
      this.ratings = JSON.parse(storedRatings);
    }
  }

  onRatingClick(rating: number) {
    this.setRating(rating, this.track);
  }

  setRating(rating: number, track: Track) {
    console.log(`Setting rating to ${rating} for ${track.name}`);
    
    // Toggle functionality: if clicking same rating as current track rating, remove it
    if (track.rating === rating) {
      console.log(`Toggling off rating ${rating} for ${track.name}`);
      
      // search for existing rating for this track in this playlist
      const obj = this.ratings.find((obj: Rating) => {
        return obj.trackURI === track.uri && obj.playlistId === this.selectedPlaylist.id;
      });
      
      if (obj !== undefined) {
        const xxx = this.ratings.findIndex((obj: Rating) => {
          return obj.trackURI === track.uri && obj.playlistId === this.selectedPlaylist.id;
        });
        // remove the rating
        this.ratings.splice(xxx, 1);
      }
      
      // update track rating
      track.rating = 0;
    } else {
      // Set new rating
      const newRating = new Rating(track.uri, this.selectedPlaylist.id, rating);
      
      // search for existing rating for this track in this playlist
      const obj = this.ratings.find((obj: Rating) => {
        return obj.trackURI === track.uri && obj.playlistId === this.selectedPlaylist.id;
      });
      
      if (obj === undefined) {
        this.ratings.push(newRating);
      } else {
        const xxx = this.ratings.findIndex((obj: Rating) => {
          return obj.trackURI === track.uri && obj.playlistId === this.selectedPlaylist.id;
        });
        this.ratings.splice(xxx, 1, newRating);
      }
      // update track rating
      track.rating = rating;
    }
    
    localStorage.setItem('ratings', JSON.stringify(this.ratings));
    this.saveRatingsToFirebase();
  }

  private async saveRatingsToFirebase(): Promise<void> {
    try {
      await this.firebaseService.saveRatings(this.ratings);
      console.log('Automatically saved ratings to Firebase');
    } catch (error) {
      console.error('Failed to auto-save ratings to Firebase:', error);
    }
  }
}