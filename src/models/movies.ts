import { ObjectId } from 'mongodb';

export default class Movie {
  constructor(
    public title: string,
    public tagLine: string,
    public overview: string,
    public year: number,
    public certification: string,
    public releaseDate: string,
    public genres: Array<string>,
    public runtime: string,
    public imdbScore: number,
    public rottenTomatoes: number,
    public poster: string,
    public trailer: string,
    public isPremier: boolean,
    public startDate: Date,
    public endDate: Date,
    public isActive: Boolean,
    public _id?: ObjectId
  ) {}
}
