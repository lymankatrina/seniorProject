import { ObjectId } from 'mongodb';

export default class User {
    constructor(
        public firstName: string,
        public lastName: string,
        public userName: string,
        public phone: string,
        public email: string,
        public isAdmin: boolean,
        public _id?: ObjectId
    ) {}
}
