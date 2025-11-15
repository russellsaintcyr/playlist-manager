import { Component, OnInit } from '@angular/core';
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

  keyPressed() {
    console.log(this.searchStr);
    this._spotifyService.searchMusic(this.searchStr, 'artist').subscribe(
      (res) => {
        console.log(res.artists.items);
        this.artists = res.artists.items;
      },
      (err) => {
        console.log('Error: ' + err.statusText);
      }
    );
  }

  constructor(private _spotifyService: SpotifyService) {
    this.searchStr = 'foo';
  }

  ngOnInit() {}

  showArtist(artist: Artist) {
    console.log(artist);
    this._spotifyService.getArtist(artist.id).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log('Error: ' + err.statusText);
      }
    );
  }
}
