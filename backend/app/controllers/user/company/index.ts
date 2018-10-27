import {Router} from 'express';

const router: Router = Router();

// Access Manager
const allowOnlyAdmin = require('../../access/allowOnlyAdmin');
const allowOnlyEmployer = require('../../access/allowOnlyEmployer');
const allowOnlyModAdmin = require('../../access/allowOnlyModAdmin');
const allowOnlyLogin = require('../../access/allowOnlyLogin');
const allowOnlyPublic = require('../../access/allowOnlyPublic');

const getCompany = require('./getCompany');
const updateCompany = require('./updateCompany');
const acceptCompany = require('./acceptCompany');
const resetCompany = require('./resetCompany');

// Get the Company data
router.get('/', [allowOnlyLogin, getCompany]);

// Update Company
router.put('/', [allowOnlyLogin, updateCompany]);

// Accept Company
router.put('/accept', [allowOnlyModAdmin, acceptCompany]);

// Reset Company
router.put('/reset', [allowOnlyLogin, resetCompany]);

// Export this Controller
export const CompanyController: Router = router;
