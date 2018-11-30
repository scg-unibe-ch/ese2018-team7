import {Router} from 'express';
import {JobController} from './job';
import {UserController} from './user';
import {Swagger} from './swagger';

const router: Router = Router();


const allowOnlyLogin = require('./access/allowOnlyLogin');

const getMenuCount = require('./getMenuCount');
const getLogo = require('./getLogo');
router.use('/jobs', JobController);
router.use('/login', UserController);

// Route for getting job count of user
router.get('/menuCount', [allowOnlyLogin, getMenuCount]);
router.get('/logo/:searchString', [getLogo]);

// Uncomment line if you want to disable the API Documentation
router.use('/docs', Swagger);

export const MainController = router;
