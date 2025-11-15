import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpotifyService } from '../../services/spotify.service';
import { Artist } from '../../classes/artist';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [SpotifyService],
})
export class DashboardComponent implements OnInit {
  searchStr: string;
  public artists: Array<Artist>;
  private destroyRef = inject(DestroyRef);

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

  constructor(private _spotifyService: SpotifyService) {
    this.searchStr = 'foo';
  }

  ngOnInit() {}

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
