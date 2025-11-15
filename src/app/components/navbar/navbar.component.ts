import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { AlertService } from '../../services/alert.service';
import { Playlist } from '../../classes/playlist';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [SpotifyService],
})
export class NavbarComponent implements OnInit {
  public isPlaying: boolean;
  public selectedPlaylist: Playlist | undefined;

  constructor(
    private spotifyService: SpotifyService,
    private alertService: AlertService
  ) {
    // console.log('getting currently playing.');
    // if (this.spotifyService.getCurrentlyPlaying() !== undefined) {
    //   console.log('got currently playing.');
    //   this.spotifyService.getCurrentlyPlaying().subscribe(res => {
    //       console.log(res);
    //       this.isPlaying = res.is_playing;
    //     },
    //     err => {
    //       console.log('Error: ' + err.statusText);
    //     }
    //   )
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
    this.spotifyService.playNextPrevious(direction).subscribe(
      (res) => {
        // this.alertService.success('Playing  ' + direction + ' track');
      },
      (err) => {
        console.error(err);
        this.alertService.error(err._body);
      }
    );
  }

  stop() {
    this.spotifyService.controlPlayback(null, 'pause').subscribe(
      (res) => {
        this.alertService.success('Stopping playback');
        this.isPlaying = false;
      },
      (err) => {
        console.error(err);
        this.alertService.error(err._body);
      }
    );
  }
}
