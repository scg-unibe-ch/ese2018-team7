import {Router} from 'express';
import {JobController} from './job';
import {UserController} from './user';

const router: Router = Router();

router.use('/jobs', JobController);
router.use('/login', UserController);

export const MainController = router;
