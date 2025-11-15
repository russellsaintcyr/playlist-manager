import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
  providers: [SpotifyService]
})
export class AlbumComponent implements OnInit {
  public album: any;

  constructor(private spotifyService: SpotifyService, private alertService: AlertService, private router: Router) {

  }

  ngOnInit() {
    if (localStorage.getItem('albumID') === null) {
      this.alertService.error('No albumID found in local storage.');
    } else {
      const albumID = localStorage.getItem('albumID');
      if (albumID) {
        this.spotifyService.getAlbum(albumID).subscribe(response => {
          this.album = response;
          // console.log(this.album);
        }, err => {
          console.error(err);
          this.alertService.error(err._body);
        }
        )
      }
    }
  }

  viewArtist(artistID) {
    localStorage.setItem('artistID', artistID);
    this.router.navigateByUrl('/artist');
  }
}
