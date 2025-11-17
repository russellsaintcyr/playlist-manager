import { Component, OnInit, inject, DestroyRef, AfterViewChecked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpotifyService } from '../../services/spotify.service';
import { AlertService } from '../../services/alert.service';
import { Rating } from '../../classes/rating';
import { NowPlayingComponent } from '../now-playing/now-playing.component';
import { Track } from '../../classes/track';
import { MetaTrack } from '../../classes/metatrack';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css'],
    providers: [SpotifyService],
    imports: [RouterLink]
})
export class PlaylistComponent implements OnInit, AfterViewChecked {
  // Injected dependencies
  private destroyRef = inject(DestroyRef);
  private _spotifyService = inject(SpotifyService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  // private playlistID: string; //46JHZX9X1hHUpxhZCkKuS1
  public selectedPlaylist;
  public tracks: Array<MetaTrack>;
  public stars0 = 0;
  public stars1 = 0;
  public stars2 = 0;
  public stars3 = 0;
  public stars4 = 0;
  public stars5 = 0;
  public ratings: Array<Rating>;
  public playlist;
  public ratingSystem = 'THUMBS';

  private ratingsLoaded: boolean;
  private tracksLoaded: boolean;
  private offset = 0;

  ngAfterViewChecked() {
    // console.log('ngAfterViewChecked called.');
    if (this.tracksLoaded && !this.ratingsLoaded) this.getRatings();
    // console.log('ratingsLoaded=' + this.ratingsLoaded);
  }

  clearRatingCounts() {
    this.stars0 = 0;
    this.stars1 = 0;
    this.stars2 = 0;
    this.stars3 = 0;
    this.stars4 = 0;
    this.stars5 = 0;
  }

  ngOnInit() {
    // console.log('ngOnInit called.');
    this.ratingsLoaded = false;
    if (localStorage.getItem('selectedPlaylist'))
      this.selectedPlaylist = JSON.parse(localStorage.getItem('selectedPlaylist')!);
    document.body.style.backgroundImage = "url('" + this.selectedPlaylist.images[0].url + "')";
    this.loadPlaylist();
    // this.ratingSystem = (localStorage.getItem('ratingSystem') !== null) ? localStorage.getItem('ratingSystem') : 'STARS';
  }

  loadPlaylist() {
    this._spotifyService.getPlaylist(this.selectedPlaylist, 0)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.tracks = res.items;
          this.playlist = res;
          // get all the other tracks
          if (this.playlist.total > this.playlist.limit + this.playlist.offset) {
            this.showAllTracks();
          } else {
            this.tracksLoaded = true;
          }
        },
        error: (err) => {
          // console.log('Error: ' + err.statusText);
          window.open(this._spotifyService.getAuthorizeURL(), '_self');
          throw new Error(err.statusText);
        },
      });
  }

  setRating(rating: number, track: Track) {
    console.log(`Setting rating to ${rating} for ${track.name}`);
    const elem = document.getElementById(this.ratingSystem + rating);
    // console.log();
    NowPlayingComponent.showStars(rating, track.id, null);
    const newRating = new Rating(track.uri, rating);
    // search for existing rating
    let obj;
    if (this.ratings !== undefined) {
      obj = this.ratings.find(function (obj: Rating) {
        return obj.trackURI === track.uri;
      });
    } else {
      this.ratings = [];
    }
    // no rating
    if (obj === undefined) {
      this.ratings.push(newRating);
    } else {
      let oldRating = -1;
      const xxx = this.ratings.findIndex(function (obj: Rating) {
        oldRating = track.rating;
        return obj.trackURI === track.uri;
      });
      // decrement any previous rating!
      if (oldRating === 0) this.stars0--;
      if (oldRating === 1) this.stars1--;
      if (oldRating === 2) this.stars2--;
      if (oldRating === 3) this.stars3--;
      if (oldRating === 4) this.stars4--;
      if (oldRating === 5) this.stars5--;
      this.ratings.splice(xxx, 1, newRating);
    }
    // update local storage
    localStorage.setItem('ratings', JSON.stringify(this.ratings));
    // increment
    if (rating === 0) this.stars0++;
    if (rating === 1) this.stars1++;
    if (rating === 2) this.stars2++;
    if (rating === 3) this.stars3++;
    if (rating === 4) this.stars4++;
    if (rating === 5) this.stars5++;
    // update local track
    track.rating = rating;
    // auto play
    // this._spotifyService.playNextPrevious('next').subscribe(res => {
    //     // update track
    //     // const intervalId = setInterval(() => this.getCurrentlyPlaying(intervalId), 1500);
    //   },
    //   err => {
    //     console.error(err);
    //     this.alertService.error(err._body);
    //   }
    // )
  }

  getRatings() {
    if (this.tracks === undefined) {
      console.log('Tracks not yet defined so not getting ratings.');
      return;
    }
    const traxx = this.tracks;
    if (localStorage.getItem('ratings') !== null) {
      if (localStorage.getItem('ratings')) this.ratings = JSON.parse(localStorage.getItem('ratings')!);
      console.log('Loaded ' + this.ratings.length + ' ratings.');
      // loop through all tracks and adjust stars
      console.log(`Looping through tracks for ratings, system ${this.ratingSystem}`);
      for (const x in this.tracks) {
        // first ensure is loaded in DOM
        const elemName = this.ratingSystem + '3-' + this.tracks[x].track.id;
        // console.log(`Searching for element ${elemName}`);
        if (document.getElementById(elemName) === null) {
          console.log(`Exiting for loop because could not find element ${elemName}`);
          break;
        } else {
          // console.log(`Found element ${elemName}`);
        }
        // see if have rating
        let obj;
        if (this.ratings !== undefined) {
          obj = this.ratings.find(function (obj: Rating) {
            return obj.trackURI === traxx[x].track.uri;
          });
        } else {
          this.ratings = [];
        }
        // set to 0 if no rating
        if (obj !== undefined) {
          this.tracks[x].track.rating = obj.rating;
        } else {
          this.tracks[x].track.rating = 0;
        }
        // change the HTML
        NowPlayingComponent.showStars(this.tracks[x].track.rating, this.tracks[x].track.id, null);
        // increment
        if (this.tracks[x].track.rating === 0) this.stars0++;
        if (this.tracks[x].track.rating === 1) this.stars1++;
        if (this.tracks[x].track.rating === 2) this.stars2++;
        if (this.tracks[x].track.rating === 3) this.stars3++;
        if (this.tracks[x].track.rating === 4) this.stars4++;
        if (this.tracks[x].track.rating === 5) this.stars5++;
      }
      console.log('Done looping through tracks for ratings');
      this.ratingsLoaded = true;
    } else {
      console.log('No ratings found in local storage');
    }
  }

  showAllTracks() {
    // call with offset, and then add
    this._spotifyService.getURL(this.playlist.next)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          console.log(
            `Adding ${res.items.length} items to tracks array (${this.playlist.total} total).`
          );
          // update next URL so the offset changes
          this.playlist.next = res.next;
          // push new tracks
          res.items.forEach((element) => {
            this.tracks.push(element);
          });
          // get all the other tracks
          if (this.playlist.total > this.tracks.length) {
            this.showAllTracks();
          } else {
            this.tracksLoaded = true;
          }
        },
        error: (err) => {
          throw new Error(err.statusText);
        },
      });
  }

  updateCounts() {
    this.clearRatingCounts();
    this.getRatings();
  }

  loadOffset(url) {
    this._spotifyService.getURL(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.tracks = res.items;
          this.playlist = res;
        },
        error: (err) => {
          throw new Error(err.statusText);
        },
      });
  }

  playRating(rating: number, action: string) {
    const arrTracks: string[] = [];
    for (const x in this.tracks) {
      // console.log(this.tracks[x].uri + ' ' + this.tracks[x].rating);
      if (this.tracks[x].track.rating === rating) {
        arrTracks.push(this.tracks[x]?.track?.uri);
      }
    }
    if (arrTracks.length > 0) {
      if (action === 'play') {
        this.alertService.info('Playing selected tracks');
        this._spotifyService.controlPlayback({ uris: arrTracks }, 'play')
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
        this._spotifyService.createPlaylist({ name: playlistName })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              this._spotifyService.addToPlaylist({ uris: arrTracks }, res.id)
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
            error: (err) => {
              console.error(err);
              this.alertService.error(err.error.error.message);
            },
          });
      }
    } else {
      this.alertService.info('No songs assigned to this rating.');
    }
  }

  playAllTracks() {
    this._spotifyService.controlPlayback({ context_uri: this.selectedPlaylist.uri }, 'play')
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

  playTrack(track) {
    localStorage.setItem('selectedTrack', JSON.stringify(track));
    // now tell to play
    this._spotifyService.controlPlayback({ uris: [track.uri] }, 'play')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          // console.log(res);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.alertService.error(err.error.error.message);
        },
      });
  }

  viewArtist(artistID) {
    localStorage.setItem('artistID', artistID);
    this.router.navigateByUrl('/artist');
  }
}
