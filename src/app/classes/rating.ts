export class Rating {
  public trackURI: string;
  public playlistId: string;
  public rating: number;

  constructor(trackURI: string, playlistId: string, rating: number) {
    this.trackURI = trackURI;
    this.playlistId = playlistId;
    this.rating = rating;
  }
}
