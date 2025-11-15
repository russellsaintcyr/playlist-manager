import { Image } from './image';

export class Artist {
  public name: string;
  public id: string;
  public images?: Image[];

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
