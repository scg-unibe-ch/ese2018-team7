import {Router} from 'express';
import {CompanyController} from './company';

// Set Router
const router: Router = Router();

// Access Manager
const allowOnlyAdmin = require('../access/allowOnlyAdmin');
const allowOnlyEmployer = require('../access/allowOnlyEmployer');
const allowOnlyModAdmin = require('../access/allowOnlyModAdmin');
const allowOnlyLogin = require('../access/allowOnlyLogin');
const allowOnlyPublic = require('../access/allowOnlyPublic');

// Routes
const getUserForEdit = require('./getUserForEdit');
const getJobCount = require('./getJobCount');
const loginCheck = require('./loginCheck');
const logout = require('./logout');
const login = require('./login');
const register = require('./register');
const setNewPassword = require('./setNewPassword');
const setPassword = require('./setPassword');
const acceptUser = require('./acceptUser');
const suspend = require('./suspend');
const deleteUser = require('./deleteUser');


// Route for hole company management
router.use('/company', CompanyController);

// Route for User edit page
router.get('/edit', [allowOnlyModAdmin, getUserForEdit] );

// Route for getting job count of user
router.get('/jobCount', [allowOnlyLogin, getJobCount]);

// Route to check if user is login
router.get('/check', [loginCheck]);

// Logout a user
router.get('/logout', [allowOnlyLogin, logout]);

// Login a user
router.get('/:user/:pass', [allowOnlyPublic, login]);

// Register User
router.post('/', [register]);

// set new Password
router.put('/password', [allowOnlyLogin, setNewPassword]);

// set new Password by admin or mod
router.put('/setPassword', [allowOnlyModAdmin, setPassword]);

// Accept a user
router.put('/accept', [allowOnlyModAdmin, acceptUser]);

// Suspend a user
router.put('/suspend', [allowOnlyModAdmin, suspend]);

// Delete another user
router.delete('/:username', [allowOnlyAdmin, deleteUser]);

// Export this Controller
export const UserController: Router = router;
