import { ObjectId } from 'mongodb';

export default class Movie {
  constructor(
    public title: string,
    public tagLine: string,
    public overview: string,
    public year: number,
    public certification: string,
    public releaseDate: Date,
    public genres: string,
    public runtime: string,
    public imdbScore: number,
    public rottenTomatoes: string,
    public fandangoAudienceScore: string,
    public poster: string,
    public trailer: string,
    public _id?: ObjectId
  ) {}
}
