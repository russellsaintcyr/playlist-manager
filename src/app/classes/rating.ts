export class Rating {
  public trackURI: string;
  public rating: number;

  constructor(trackURI: string, rating: number) {
    this.trackURI = trackURI;
    this.rating = rating;
  }
}
