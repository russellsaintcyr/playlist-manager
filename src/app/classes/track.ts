import { Artist } from './artist';
import { Album } from './album';

export class Track {
  public uri: string;
  public name: string;
  public coverImage: string;
  public albumName: string;
  public id: string;
  // TODO create artists array with IDs for linking
  public mainArtist: string;
  public mainArtistID: string;
  public rating: number;
  public album: Album;
  public albumYear: Date;
  public albumID: string;
  public progress_ms: number;
  public duration_ms: number;
  public is_playing: boolean;
  public artists: Artist[];

  constructor(
    uri: string,
    name: string,
    cover: string,
    albumName: string,
    mainArtist: string,
    id: string,
    progress_ms: number,
    duration_ms: number,
    is_playing: boolean,
    albumYear: Date,
    albumID: string,
    mainArtistID: string,
    artists: Artist[]
  ) {
    this.uri = uri;
    this.name = name;
    this.coverImage = cover;
    this.albumName = albumName;
    this.mainArtist = mainArtist;
    this.id = id;
    this.progress_ms = progress_ms;
    this.duration_ms = duration_ms;
    this.is_playing = is_playing;
    this.albumYear = albumYear;
    this.albumID = albumID;
    this.mainArtistID = mainArtistID;
    this.artists = artists;
  }
}
