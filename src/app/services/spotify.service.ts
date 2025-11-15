import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class SpotifyService {
  private authURL: string;
  // TODO remove need for user ID
  private readonly userID: string;
  private readonly bearerToken: string | null;
  private readonly callbackRedirectURI: string;
  private readonly headers;

  constructor(private httpClient: HttpClient) {
    // save state to return if token expired
    // console.log('SpotifyService constructor', location);
    const currentState = location.hash;
    if (currentState !== 'callback') {
      localStorage.setItem('savedState', currentState);
    }
    // TODO remove hard-coded user ID
    this.userID = 'x1111x';
    this.bearerToken = localStorage.getItem('bearerToken');
    console.log(`bearerToken`, this.bearerToken);
    this.callbackRedirectURI = `${location.origin}${location.pathname}#/callback`;
    console.log(`callbackRedirectURI: ${this.callbackRedirectURI}`);
    this.headers = new HttpHeaders({ Authorization: 'Bearer ' + this.bearerToken });
    console.log(`this.headers:`, this.headers);
  }

  getPlaylist(playlist, offset: number): Observable<any> {
    const spotURL =
      'https://api.spotify.com/v1/users/' +
      playlist.owner.id +
      '/playlists/' +
      playlist.id +
      '/tracks?offset=' +
      offset;
    return this.httpClient.get(spotURL, { headers: this.headers });
  }

  searchMusic(searchString: string, type: string): Observable<any> {
    const spotURL = 'https://api.spotify.com/v1/search?q=' + searchString + '&type=' + type;
    return this.httpClient.get(spotURL, { headers: this.headers });
  }

  getArtist(artistID: string): Observable<any> {
    const spotURL = 'https://api.spotify.com/v1/artists/' + artistID;
    return this.httpClient.get(spotURL, { headers: this.headers });
  }

  getArtistAlbums(artistID: string): Observable<any> {
    const spotURL = 'https://api.spotify.com/v1/artists/' + artistID + '/albums';
    return this.httpClient.get(spotURL, { headers: this.headers });
  }

  playNextPrevious(direction): Observable<any> {
    const URL = 'https://api.spotify.com/v1/me/player/' + direction;
    return this.httpClient.post(URL, null, { headers: this.headers });
  }

  getCurrentlyPlaying(): Observable<any> {
    const URL = 'https://api.spotify.com/v1/me/player/currently-playing';
    return this.httpClient.get(URL, { headers: this.headers });
  }

  controlPlayback(body, verb): Observable<any> {
    const URL = 'https://api.spotify.com/v1/me/player/' + verb;
    return this.httpClient.put(URL, body, { headers: this.headers });
  }

  getAuthorizeURL() {
    const client_id = environment.spotifyClientId;
    const response_type = 'token'; // Implicit Grant Flow https://developer.spotify.com/web-api/authorization-guide/#implicit-grant-flow
    const redirect_uri = this.callbackRedirectURI;
    const scopes =
      'user-read-currently-playing user-read-playback-state playlist-modify-private playlist-modify-public playlist-read-private streaming user-modify-playback-state user-read-currently-playing user-read-recently-played';
    console.log('Spotify scopes: ' + scopes);
    this.authURL =
      'http://accounts.spotify.com/authorize?client_id=' +
      client_id +
      '&scope=' +
      encodeURIComponent(scopes) +
      '&response_type=' +
      response_type +
      '&show_dialog=false' +
      '&redirect_uri=' +
      encodeURIComponent(redirect_uri);
    // console.log(this.authURL);
    return this.authURL;
  }

  getURL(spotURL): Observable<any> {
    return this.httpClient.get(spotURL, { headers: this.headers });
  }

  getPlaylists(): Observable<any> {
    const spotURL = 'https://api.spotify.com/v1/users/' + this.userID + '/playlists/';
    return this.httpClient.get(spotURL, { headers: this.headers });
  }

  createPlaylist(body): Observable<any> {
    const spotURL = 'https://api.spotify.com/v1/users/' + this.userID + '/playlists/';
    return this.httpClient.post(spotURL, body, { headers: this.headers });
  }

  addToPlaylist(body, playlistID: string): Observable<any> {
    const spotURL = 'https://api.spotify.com/v1/users/' + this.userID + '/playlists/' + playlistID + '/tracks';
    return this.httpClient.post(spotURL, body, { headers: this.headers });
  }

  getAlbum(albumID: string): Observable<any> {
    const spotURL = 'https://api.spotify.com/v1/albums/' + albumID;
    return this.httpClient.get(spotURL, { headers: this.headers });
  }
}
