import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpotifyService } from '../../services/spotify.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-playlists',
    templateUrl: './playlists.component.html',
    styleUrls: ['./playlists.component.css'],
    providers: [SpotifyService],
})
export class PlaylistsComponent implements OnInit {
  private priv: string;
  public pub: string;
  public tracks: Object;
  public playlists;
  private destroyRef = inject(DestroyRef);

  constructor(
    private _spotifyService: SpotifyService,
    private alertService: AlertService,
    private router: Router
  ) {
    console.log('PlaylistsComponent constructor called  ');  
    this.priv = 'Privy';
    this.pub = 'Pubby';
  }

  ngOnInit() {
    // check if we have playlists
    if (localStorage.getItem('playlists') === null) {
      this.retrievePlaylists();
      console.info('Retrieved playlists.');
    } else {
      if (localStorage.getItem('playlists')) this.playlists = JSON.parse(localStorage.getItem('playlists')!);
      console.info('Loaded playlists from local data.');
    }
  }

  refreshPlaylists() {
    this.playlists = null;
    localStorage.removeItem('playlists');
    this.retrievePlaylists();
    this.alertService.info('Refreshed playlists.');
  }

  reAuthorize(intervalId) {
    // TODO handle auth token globally via new Error
    window.open(this._spotifyService.getAuthorizeURL(), '_self');
    clearInterval(intervalId);
  }

  retrievePlaylists() {
    this._spotifyService.getPlaylists()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          // console.log('Full playlist data:', res);
          // console.log('Sample playlist item:', res.items?.[0]);
          this.playlists = res;
          localStorage.setItem('playlists', JSON.stringify(res));
        },
        error: (err) => {
          this.alertService.warn('Error retrieving playlists: ' + err.statusText);
          this.alertService.info('Re-authorizing Spotify token in 2 seconds...');
          let intervalId = setInterval(() => this.reAuthorize(intervalId), 2000);
          // throw new Error(err.statusText);
        },
      });
  }

  setPlaylist(playlist) {
    localStorage.setItem('selectedPlaylist', JSON.stringify(playlist));
    // this.alertService.success('Set playlist ID to ' + playlist.id);
    this.router.navigateByUrl('/playlist');
  }

  onPlaylistClick(event: Event, playlist) {
    // Add click effect class to the clicked card
    const card = event.currentTarget as HTMLElement;
    card.classList.add('clicked');
    
    // Remove the effect and navigate after a brief delay
    setTimeout(() => {
      card.classList.remove('clicked');
      this.setPlaylist(playlist);
    }, 200);
  }

  loadOffset(url) {
    this._spotifyService.getURL(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.playlists = res;
          localStorage.setItem('playlists', JSON.stringify(res));
        },
        error: (err) => {
          throw new Error(err.statusText);
        },
      });
  }

  showPlaylist(offset) {
    this._spotifyService.getPlaylist('46JHZX9X1hHUpxhZCkKuS1', offset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.tracks = res.items;
          localStorage.setItem('tracks-' + offset, JSON.stringify(res.items));
        },
        error: (err) => {
          // console.log('Error: ' + err.statusText);
          throw new Error(err.statusText);
        },
      });
  }
}
