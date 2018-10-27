import {Request} from '../interfaces/request.interface';
import {Response} from 'express';

export const asyncRoute = (route: any) => (req: Request, res: Response, next = console.error) => {
  Promise.resolve(route(req, res)).catch(next);
};
