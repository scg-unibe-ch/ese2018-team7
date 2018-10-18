import {Router, Request, Response} from 'express';
import {Job} from '../models/job.model';
import {Sequelize} from 'sequelize-typescript';
import {Company} from '../models/company.model';

const router: Router = Router();

// Get All Public Jobs
router.get('/', async (req: Request, res: Response) => {
  const instances = await Job.findAll({where: Sequelize.and(
    {approved: true},
    {startofpublication: {lte: Math.floor(Date.now() / 1000)}},
    {endofpublication: {gte: Math.floor(Date.now() / 1000)}},
    )});
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});

// Get All editable Jobs
router.get('/editable', async (req: Request, res: Response) => {
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
// Get if a job is approved
router.get('/company/:id', async (req: Request, res: Response) => {
  console.log('company');

  const id = parseInt(req.params.id);
  const job = await Job.findById(id);
  if (job == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }

  // @ts-ignore
  let company = await Company.findByPrimary(job.owner);
  if (company == null) {
    company = new Company();
    company.name = job.owner;
    // tslint:disable:max-line-length
    company.logo = 'data:image/png;base64,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';
    // tslint:enable:max-line-length
  }

  res.statusCode = 200;
  res.send({'name': company.name, 'logo': company.logo});
  return;

});

// Search for Jobs
router.get('/search', async (req: Request, res: Response) => {
  console.log('search');
  console.log(req.query);
  // Add % to create full text search on title
  const title = (req.query.title != null) ? '%' + req.query.title + '%' : '%';

  // Add % to create full text search on company
  const company = (req.query.company != null) ? '%' + req.query.company + '%' : '%';

  // Default start after is 1.1.1970
  const startAfter = (req.query.startAfter != null) ? req.query.startAfter : 0;

  // Default start before is now + 10 years
  const startBefore = (req.query.startBefore != null) ? req.query.startBefore :
    Math.floor(new Date(new Date().setFullYear(new Date().getFullYear() + 10)).getTime() / 1000);

  // Default Workload is >= 0 and <= 100
  const workloadGt = (req.query.workloadGt != null) ? req.query.workloadGt : 0;
  const workloadLt = (req.query.workloadLt != null) ? req.query.workloadLt : 100;

  const results = await Job.findAll({where: Sequelize.and(
    {'title': {like: title}},
    {'company': {like: company}},
    {'startofwork': {gte: startAfter}},
    {'startofwork': {lte: startBefore}},
    {'workload': {gte: workloadGt}},
    {'workload': {lte: workloadLt}}
    )});

  if (results == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  res.statusCode = 200;
  res.send(results);
  return;
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
