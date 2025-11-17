import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpotifyService } from '../../services/spotify.service';
import { Artist } from '../../classes/artist';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [SpotifyService],
    imports: [FormsModule]
})
export class DashboardComponent implements OnInit {
  // Injected dependencies
  private destroyRef = inject(DestroyRef);
  private _spotifyService = inject(SpotifyService);

  // Public properties
  searchStr: string = '';
  public artists: Array<Artist>;

  ngOnInit() {}

  keyPressed() {
    console.log(this.searchStr);
    this._spotifyService.searchMusic(this.searchStr, 'artist')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          console.log(res.artists.items);
          this.artists = res.artists.items;
        },
        error: (err) => {
          console.log('Error: ' + err.statusText);
        },
      });
  }

  showArtist(artist: Artist) {
    console.log(artist);
    this._spotifyService.getArtist(artist.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log('Error: ' + err.statusText);
        },
      });
  }
}
