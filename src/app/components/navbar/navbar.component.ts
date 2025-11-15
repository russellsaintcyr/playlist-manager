import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpotifyService } from '../../services/spotify.service';
import { AlertService } from '../../services/alert.service';
import { Playlist } from '../../classes/playlist';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    providers: [SpotifyService],
    standalone: true,
    imports: [RouterLink],
})
export class NavbarComponent implements OnInit {
  public isPlaying: boolean;
  public selectedPlaylist: Playlist | undefined;
  private destroyRef = inject(DestroyRef);

  constructor(
    private spotifyService: SpotifyService,
    private alertService: AlertService
  ) {
    // console.log('getting currently playing.');
    // if (this.spotifyService.getCurrentlyPlaying() !== undefined) {
    //   console.log('got currently playing.');
    //   this.spotifyService.getCurrentlyPlaying()
    //     .pipe(takeUntilDestroyed(this.destroyRef))
    //     .subscribe({
    //       next: (res) => {
    //         console.log(res);
    //         this.isPlaying = res.is_playing;
    //       },
    //       error: (err) => {
    //         console.log('Error: ' + err.statusText);
    //       }
    //     });
    // } else {
    //   console.log('got currently playing returned undefined');
    // }
  }

  ngOnInit() {
    this.selectedPlaylist = localStorage.getItem('selectedPlaylist')
      ? JSON.parse(localStorage.getItem('selectedPlaylist')!)
      : undefined;
  }

  playNextPrevious(direction: string) {
    this.spotifyService.playNextPrevious(direction)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          // this.alertService.success('Playing  ' + direction + ' track');
        },
        error: (err) => {
          console.error(err);
          this.alertService.error(err._body);
        },
      });
  }

  stop() {
    this.spotifyService.controlPlayback(null, 'pause')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.alertService.success('Stopping playback');
          this.isPlaying = false;
        },
        error: (err) => {
          console.error(err);
          this.alertService.error(err._body);
        },
      });
  }
}
