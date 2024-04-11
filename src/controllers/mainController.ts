import { Request, Response } from 'express';

export class MainController {
    async getHealthCheck(req: Request, res: Response) {
        return res.status(200).json({ hello: 'world!' });
    }
}
