import {Component, OnInit} from '@angular/core';
import {SpotifyService} from '../../services/spotify.service';
import {AlertService} from '../../services/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
  providers: [SpotifyService]
})
export class ArtistComponent implements OnInit {

  private artistID: string | null;
  public artist: any;
  public albums: any;

  constructor(private spotifyService: SpotifyService, 
    private alertService: AlertService, 
    private router: Router) {
  }

  ngOnInit() {
    if (localStorage.getItem('artistID') === null) {
      this.alertService.error('No artistID found in local storage.');
    } else {
      this.artistID = localStorage.getItem('artistID');
      if (this.artistID) {
        this.getArtistDetails();
        this.getArtistAlbumDetails();
      } else {
        this.alertService.error('artistID is null.');
      }
    }
  }

  getArtistDetails() {
    this.spotifyService.getArtist(this.artistID!).subscribe(response => {
        this.artist = response;
        console.log(this.artist);
      }, err => {
        console.error(err);
        this.alertService.error(err._body);
      }
    )
  }

  getArtistAlbumDetails() {
    this.spotifyService.getArtistAlbums(this.artistID!).subscribe(response => {
        this.albums = response.items;
        // console.log(this.albums);
      }, err => {
        console.error(err);
        this.alertService.error(err._body);
      }
    )
  }

  viewAlbum(albumID) {
    localStorage.setItem('albumID', albumID);
    this.router.navigateByUrl('/album');
  }

}
