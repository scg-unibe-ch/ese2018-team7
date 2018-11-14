import {Router} from 'express';
import {JobController} from './job';
import {UserController} from './user';

const router: Router = Router();


const allowOnlyLogin = require('./access/allowOnlyLogin');

const getMenuCount = require('./getMenuCount');

router.use('/jobs', JobController);
router.use('/login', UserController);

// Route for getting job count of user
router.get('/menuCount', [allowOnlyLogin, getMenuCount]);

export const MainController = router;
