import {Router, Request, Response} from 'express';
import {Company} from '../models/company.model';
import {User} from '../models/user.model';

const router: Router = Router();

// Just for debugging... -> Get all companys
router.get('/', async (req: Request, res: Response) => {
  const instances = await Company.findAll();
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});
