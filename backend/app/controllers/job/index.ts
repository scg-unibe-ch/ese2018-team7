import {Router} from 'express';

const router: Router = Router();


// Access Manager
const allowOnlyAdmin = require('../access/allowOnlyAdmin');
const allowOnlyEmployer = require('../access/allowOnlyEmployer');
const allowOnlyModAdmin = require('../access/allowOnlyModAdmin');
const allowOnlyLogin = require('../access/allowOnlyLogin');
const allowOnlyPublic = require('../access/allowOnlyPublic');


const getJobs = require('./getJobs');
const getEditableJobs = require('./getEditableJobs');
const addJob = require('./addJob');
const acceptJob = require('./acceptJob');
const resetJob = require('./resetJob');
const updateJob = require('./updateJob');
const deleteJob = require('./deleteJob');

// Get All Public Jobs (or with search applied)
router.get('/', [getJobs]);

// Get All editable Jobs
router.get('/editable', [allowOnlyLogin, getEditableJobs]);

// Add a Job
router.post('/', [allowOnlyEmployer, addJob]);

// Apply changed to Job
router.put('/apply/:id', [allowOnlyModAdmin, acceptJob]);

// Reset changed Job
router.put('/reset/:id', [allowOnlyLogin, resetJob]);

// Update a specific Job
router.put('/:id', [allowOnlyLogin, updateJob]);

// Delete a job
router.delete('/:id', [allowOnlyLogin, deleteJob]);

export const JobController: Router = router;
