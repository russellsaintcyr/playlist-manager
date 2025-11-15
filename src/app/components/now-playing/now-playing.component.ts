import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { AlertService } from '../../services/alert.service';
import { Track } from '../../classes/track';
import { Rating } from '../../classes/rating';
import { Router } from '@angular/router';
import { Artist } from '../../classes/artist';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.css'],
  providers: [SpotifyService],
})
export class NowPlayingComponent implements OnInit {
  // private spotifyService: SpotifyService;
  // private alertService: AlertService;
  // private static spotifyService: SpotifyService;
  // private static alertService: AlertService;

  private timerRefresh: number;
  private timerProgressBar: number;
  private refreshPeriod = 60000;
  private initial_progress_ms: number;
  private used_ms = 0;

  adjusted_progress_ms: number;

  public track: Track;
  public lastTrack: Track;
  public ratings: Array<Rating>;
  public autoSkip: boolean;
  public loadingTrack: boolean;
  public selectedPlaylist;

  static showStars(rating, trackID, intervalId2) {
    if (intervalId2 !== null) {
      clearInterval(intervalId2);
    }
    const cssSelected = 'glyphicon glyphicon-star star-selected nowPlaying';
    const cssUnSelected = 'glyphicon glyphicon-star star-unselected nowPlaying';
    if (document.getElementById('star1-' + trackID) !== null) {
      (document.getElementById('star1-' + trackID) as HTMLElement).className =
        rating >= 1 ? cssSelected : cssUnSelected;
      (document.getElementById('star2-' + trackID) as HTMLElement).className =
        rating >= 2 ? cssSelected : cssUnSelected;
      (document.getElementById('star3-' + trackID) as HTMLElement).className =
        rating >= 3 ? cssSelected : cssUnSelected;
      (document.getElementById('star4-' + trackID) as HTMLElement).className =
        rating >= 4 ? cssSelected : cssUnSelected;
      (document.getElementById('star5-' + trackID) as HTMLElement).className =
        rating === 5 ? cssSelected : cssUnSelected;
    } else {
      // console.log('Failed to get element with ID star1-' + trackID + '. Retrying in 1 second.');
      const intervalId2: number = setInterval(() => this.showStars(rating, trackID, intervalId2), 1000);
    }
  }

  constructor(
    private spotifyService: SpotifyService,
    private alertService: AlertService,
    private router: Router
  ) {
    console.log('NowPlayingComponent constructor called');
  }

  ngOnInit() {
    this.autoSkip = false;
    this.getCurrentlyPlaying(null);
    if (localStorage.getItem('ratings') === null) {
      console.log('ngOnInit - No local ratings yet set.');
      this.ratings = [];
      localStorage.setItem('ratings', JSON.stringify(this.ratings));
    } else {
      if (localStorage.getItem('ratings')) this.ratings = JSON.parse(localStorage.getItem('ratings')!);
      console.log('ngOnInit - Loaded ' + this.ratings.length + ' ratings from local data.');
    }
    if (localStorage.getItem('selectedPlaylist'))
      this.selectedPlaylist = JSON.parse(localStorage.getItem('selectedPlaylist')!);
    // reload in X seconds
    console.log('ngOnInit - Reloading now playing page in ' + this.refreshPeriod / 1000 + ' seconds.');
    this.timerRefresh = setTimeout(function () {
      location.reload();
    }, this.refreshPeriod);
  }

  ngOnDestroy() {
    console.log('Clearing timers');
    clearTimeout(this.timerRefresh);
    clearTimeout(this.timerProgressBar);
  }

  computeTime(obj) {
    // console.log(this.adjusted_progress_ms);
    obj.used_ms += 1000;
    this.adjusted_progress_ms = this.initial_progress_ms + this.used_ms;
    this.timerProgressBar = setTimeout(function () {
      obj.computeTime(obj);
    }, 1000);
  }

  getCurrentlyPlaying(intervalId) {
    this.spotifyService.getCurrentlyPlaying().subscribe(
      (response) => {
        // console.log('getCurrentlyPlaying response:', response);
        // console.log(response);
        if (response === null || response.item === null) {
          this.alertService.warn('No track is currently playing.');
        } else {
          // store last track if there is one
          if (this.track !== undefined) {
            this.lastTrack = this.track;
          }
          // first image in array is largest
          const artists: Artist[] = [];
          response.item.artists.forEach((element) => artists.push(new Artist(element.name, element.id)));
          this.track = new Track(
            response.item.uri,
            response.item.name,
            response.item.album.images[0].url,
            response.item.album.name,
            response.item.artists[0].name,
            response.item.id,
            response.progress_ms,
            response.item.duration_ms,
            response.is_playing,
            response.item.album.release_date,
            response.item.album.id,
            response.item.artists[0].id,
            artists
          );
          // console.log(this.track);
          // set playback times, and call loop
          this.used_ms = 0;
          this.initial_progress_ms = this.track.progress_ms;
          if (this.track.is_playing) {
            this.computeTime(this);
          }
          // images
          document.body.style.backgroundImage = "url('" + response.item.album.images[0].url + "')";
          if (intervalId !== null) {
            clearInterval(intervalId);
          }
          // search for existing rating
          console.log('Searching for rating for ' + response.item.uri);
          const obj = this.ratings.find(function (obj: Rating) {
            return obj.trackURI === response.item.uri;
          });
          if (obj === undefined) {
            console.log(`No rating found for ${response.item.uri}`);
            // NowPlayingComponent.showStars(0, response.item.id, null);
          } else {
            this.track.rating = obj.rating;
            // NowPlayingComponent.showStars(obj.rating, response.item.id, null);
            // TODO add this as a preference/setting
            if (this.autoSkip) {
              console.log('Skipping song since is already rated.');
              this.playNextPrevious('next');
            }
          }
        }
        this.loadingTrack = false;
      },
      (err) => {
        this.alertService.warn('Error loading now playing. ' + err.statusText);
        // throw new Error(err.statusText);
        window.open(this.spotifyService.getAuthorizeURL(), '_self');
        this.loadingTrack = false;
      }
    );
  }

  setRating(rating: number, track: Track) {
    console.log(`Setting rating to ${rating} for ${track.name}`);
    const elem = document.getElementById('star' + rating);
    // console.log();
    NowPlayingComponent.showStars(rating, track.id, null);
    const newRating = new Rating(track.uri, rating);
    // search for existing rating
    const obj = this.ratings.find(function (obj: Rating) {
      return obj.trackURI === track.uri;
    });
    if (obj === undefined) {
      this.ratings.push(newRating);
    } else {
      const xxx = this.ratings.findIndex(function (obj: Rating) {
        return obj.trackURI === track.uri;
      });
      this.ratings.splice(xxx, 1, newRating);
    }
    localStorage.setItem('ratings', JSON.stringify(this.ratings));
    // update track rating
    this.track.rating = rating;
    // TODO enable next line via user preference, for now do automatically
    // this.playNextPrevious('next');
  }

  playNextPrevious(direction: string) {
    this.loadingTrack = true;
    this.spotifyService.playNextPrevious(direction).subscribe(
      (res) => {
        // update track
        const intervalId = setInterval(() => this.getCurrentlyPlaying(intervalId), 1500);
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
        this.track.is_playing = false;
        clearTimeout(this.timerProgressBar);
      },
      (err) => {
        console.error(err);
        this.alertService.error(err._body);
      }
    );
  }

  play() {
    this.spotifyService.controlPlayback(null, 'play').subscribe(
      (res) => {
        this.track.is_playing = true;
        this.computeTime(this);
      },
      (err) => {
        console.error(err);
        this.alertService.error(err._body);
      }
    );
  }

  viewAlbum() {
    localStorage.setItem('albumID', this.track.albumID);
    this.router.navigateByUrl('/album');
  }

  viewArtist(artistID) {
    localStorage.setItem('artistID', artistID);
    this.router.navigateByUrl('/artist');
  }
}
