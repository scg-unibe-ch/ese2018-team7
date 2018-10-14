import {Router, Request, Response} from 'express';
import {Job} from '../models/job.model';
import {Sequelize} from 'sequelize-typescript';

const router: Router = Router();

// Get All Public Jobs
router.get('/', async (req: Request, res: Response) => {
  const instances = await Job.findAll({where: Sequelize.and(
    {approved: true},
    )});
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});

// Get All editable Jobs
router.get('/editable', async (req: Request, res: Response) => {
console.log("Editable");
  // Admins can view all non-public Jobs
  if (req.session != null && req.session.user != null && req.session.user.type === 0) {
    const instances = await Job.findAll();
    res.statusCode = 200;
    res.send(instances.map(e => e.toSimplification()));

  // Employer can only view his own non-public Jobs
  } else if (req.session != null && req.session.user != null) {
    const instances = await Job.findAll({
      where: Sequelize.and(
        {owner: req.session.user.username},
      )
    });
    res.statusCode = 200;
    res.send(instances.map(e => e.toSimplification()));

  // Everyone else has no editable job
  } else {
    res.statusCode = 200;
    res.send();
  }
});
// Get if a job is approved
router.get('/approved/:id', async (req: Request, res: Response) => {
console.log('approved');

  if (req.session != null && req.session.user != null) {
    const id = parseInt(req.params.id);
    const instance = await Job.findById(id);
    if (instance == null) {
      res.statusCode = 404;
      res.json({
        'message': 'not found'
      });
      return;
    }
    res.statusCode = 200;
    res.send({approved: instance.approved});
    return;
    // For everyone else it isn't approved
  } else {
    res.statusCode = 200;
    res.send({approved: false});
  }
});

// Get a specific Job
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await Job.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  res.statusCode = 200;
  res.send(instance.toSimplification());
});

// Add a Job
router.post('/', async (req: Request, res: Response) => {

  if (req.session != null && req.session.user != null) {

    const instance = new Job();
    instance.fromSimplification(req.body);

    // Set the owner
    instance.owner = req.session.user.username;

    // Set approved if an admin added job, and not approved else
    instance.approved = req.session.user.type === 0 ;

    await instance.save();
    res.statusCode = 201;
    res.send(instance.toSimplification());

  } else {
    res.statusCode = 403;
    res.send({'errorMessage': 'You\'re not allowed to create a Job'});
  }
});

// Update a specific Job
router.put('/:id', async (req: Request, res: Response) => {

  if (req.session != null && req.session.user != null) {
    const id = parseInt(req.params.id);
    const instance = await Job.findById(id);
    if (instance == null) {
      res.statusCode = 404;
      res.json({
        'message': 'not found'
      });
      return;

    // Employer can only edit there own Jobs
    } else if (req.session.user.username !== instance.owner && req.session.user.type !== 0) {
      res.statusCode = 403;
      res.send({'errorMessage': 'You\'re not allowed to update this Job'});
      return;
    }
    // Employer can't approve Job
    if (req.session.user.type !== 0 && !instance.approved) {
      req.body.approved = false;
    }
    // Owner stays the same
    req.body.owner = instance.owner;
    instance.fromSimplification(req.body);
    await instance.save();
    res.statusCode = 200;
    res.send(instance.toSimplification());
  } else {
    res.statusCode = 403;
    res.send({'errorMessage': 'You\'re not allowed to update a Job'});
  }
});

// Delete a job
router.delete('/:id', async (req: Request, res: Response) => {
  if (req.session != null && req.session.user != null) {
    const id = parseInt(req.params.id);
    const instance = await Job.findById(id);
    if (instance == null) {
      res.statusCode = 404;
      res.json({
        'message': 'not found'
      });
      return;
    // Employer can only delete there own Jobs
    } else if (req.session.user.username !== instance.owner && req.session.user.type !== 0) {
      res.statusCode = 403;
      res.send({'errorMessage': 'You\'re not allowed to delete this Job'});
      return;
    }
    instance.fromSimplification(req.body);
    await instance.destroy();
    res.statusCode = 204;
    res.send();
  } else {
    res.statusCode = 403;
    res.send({'errorMessage': 'You\'re not allowed to delete a Job'});
  }
});

export const JobController: Router = router;
