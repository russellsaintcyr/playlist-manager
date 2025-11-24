import { Component, Input, Output, EventEmitter, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpotifyService } from '../../services/spotify.service';
import { AlertService } from '../../services/alert.service';
import { Rating } from '../../classes/rating';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-playlist-metadata',
  templateUrl: './playlist-metadata.component.html',
  styleUrls: ['./playlist-metadata.component.css'],
  imports: [CommonModule],
  providers: [SpotifyService]
})
export class PlaylistMetadataComponent {
  @Input() selectedPlaylist: any;
  @Input() stars0: number = 0;
  @Input() stars3: number = 0;
  @Input() stars4: number = 0;
  @Input() stars5: number = 0;
  @Input() tracks: any[] = [];
  @Input() ratings: Rating[] = [];
  
  @Output() updateCountsClick = new EventEmitter<void>();
  
  private destroyRef = inject(DestroyRef);
  
  constructor(
    private spotifyService: SpotifyService,
    private alertService: AlertService
  ) {}
  
  playRating(rating: number, action: string) {
    const arrTracks: string[] = [];
    for (const x in this.tracks) {
      // Check if track has the specified rating in this specific playlist
      const trackRating = this.ratings.find(r => 
        r.trackURI === this.tracks[x]?.track?.uri && 
        r.playlistId === this.selectedPlaylist.id
      );
      
      if (trackRating && trackRating.rating === rating) {
        arrTracks.push(this.tracks[x]?.track?.uri);
      }
    }
    if (arrTracks.length > 0) {
      if (action === 'play') {
        this.alertService.info('Playing selected tracks');
        this.spotifyService.controlPlayback({ uris: arrTracks }, 'play')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              console.log('Playback successfully called');
            },
            error: (err: HttpErrorResponse) => {
              console.error(err);
              this.alertService.error(err.error.error.message);
            },
          });
      } else {
        this.alertService.info('Creating new playlist');
        // TODO get playlist name from user?
        const playlistName = rating + '-star Tracks';
        // first create playlist, then add tracks
        this.spotifyService.createPlaylist({ name: playlistName })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              this.spotifyService.addToPlaylist({ uris: arrTracks }, res.id)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                  next: (res2) => {
                    this.alertService.success(
                      'Created new playlist ' + playlistName + ' with ' + arrTracks.length + ' tracks.'
                    );
                  },
                  error: (err: HttpErrorResponse) => {
                    console.error(err);
                    this.alertService.error(err.error.error.message);
                  },
                });
            },
            error: (err: HttpErrorResponse) => {
              console.error(err);
              this.alertService.error(err.error.error.message);
            },
          });
      }
    } else {
      this.alertService.warn('No tracks found with rating ' + rating);
    }
  }
  
  playAllTracks() {
    this.spotifyService.controlPlayback({ context_uri: this.selectedPlaylist.uri }, 'play')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.alertService.success('Playing all tracks in playlist');
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.alertService.error(err.error.error.message);
        },
      });
  }
  
  updateCounts() {
    this.updateCountsClick.emit();
  }
}