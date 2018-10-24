import {Router, Request, Response} from 'express';
import {Job} from '../models/job.model';
import {Sequelize} from 'sequelize-typescript';
import {Company} from '../models/company.model';

const router: Router = Router();

// Get All Public Jobs
router.get('/', async (req: Request, res: Response) => {
  const instances = await Job.findAll({
    where: Sequelize.and(
      {approved: true},
      {startofpublication: {lte: Math.floor(Date.now() / 1000)}},
      {endofpublication: {gte: Math.floor(Date.now() / 1000)}},
      )
  });
  const companys: Company[] = await Company.findAll();
  res.statusCode = 200;
  res.send(instances.map((e: Job) => {
    let company: Company = new Company();
    for (let i = 0; i < companys.length; i++) {
      if (e.owner === companys[i].username) {
        company = companys[i];
        break;
      }
    }
    const job = e.toSimplification();
    if (company != null) {
      job['companyName'] = company.name;
      job['companyLogo'] = company.logo;
    }

    return job;
  }));
});

// Get All editable Jobs
router.get('/editable', async (req: Request, res: Response) => {
  // Admins can view all non-public Jobs
  if (req.session != null && req.session.user != null && req.session.user.type === 0) {
    const instances = await Job.findAll();
    res.statusCode = 200;
    res.send(instances.map((e: any) => {
      const cValue = JSON.parse(e['dataValues']['changes']);
      let changed = false;
      // Apply changes for user
      for (const key in e['dataValues']) {
        if (e['dataValues'].hasOwnProperty(key)) {
          if (cValue[key] != null && e['dataValues'][key] !== cValue[key]) {
            e['dataValues'][key] = cValue[key];
            changed = true;
          }
        }
      }
      const val = e.toSimplification();
      val['changed'] = changed;
      return val;
    }));

  // Employer can only view his own non-public Jobs
  } else if (req.session != null && req.session.user != null) {
    const instances = await Job.findAll({
      where: Sequelize.and(
        {owner: req.session.user.username},
      )
    });
    res.statusCode = 200;
    res.send(instances.map((e: any) => {
      const cValue = JSON.parse(e['dataValues']['changes']);
      let changed = false;
      for (const key in e['dataValues']) {
        if (e['dataValues'].hasOwnProperty(key)) {
          if (cValue[key] != null && e['dataValues'][key] !== cValue[key]) {
            e['dataValues'][key] = cValue[key];
            changed = true;
          }
        }
      }
      const val = e.toSimplification();
      val['changed'] = changed;
      return val;
    }));

  // Everyone else has no editable job
  } else {
    res.statusCode = 200;
    res.send('[]');
  }
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
    {'departement': {like: company}},
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
  const companys: Company[] = await Company.findAll();
  res.statusCode = 200;
  res.send(results.map((e: Job) => {
    let company2: Company = new Company();
    for (let i = 0; i < companys.length; i++) {
      if (e.owner === companys[i].username) {
        company2 = companys[i];
        break;
      }
    }
    const job = e.toSimplification();
    if (company2 != null) {
      job['companyName'] = company2.name;
      job['companyLogo'] = company2.logo;
    }

    return job;
  }));
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

    instance.changes = JSON.stringify(req.body);

    await instance.save();
    res.statusCode = 201;
    res.send(instance.toSimplification());

  } else {
    res.statusCode = 403;
    res.send({'errorMessage': 'You\'re not allowed to create a Job'});
  }
});

// Apply changed to Job
router.put('/apply/:id', async (req: Request, res: Response) => {

  if (req.session != null && req.session.user != null && req.session.user.type === 0) {
    const id = parseInt(req.params.id);
    const instance = await Job.findById(id);
    if (instance == null) {
      res.statusCode = 404;
      res.json({
        'message': 'not found'
      });
      return;

    }
    instance.applyChanges();
    instance.approved = true;
    await instance.save();
    res.statusCode = 200;
    res.send(instance.toSimplification());
  } else {
    res.statusCode = 403;
    res.send({'errorMessage': 'You\'re not allowed to update a Job'});
  }
});
// Reset changed Job
router.put('/reset/:id', async (req: Request, res: Response) => {

  if (req.session != null && req.session.user != null) {
    const id = parseInt(req.params.id);
    const instance = await Job.findById(id);
    if (instance == null) {
      res.statusCode = 404;
      res.json({
        'message': 'not found'
      });
      return;

    } else if (req.session.user.type !== 0 && req.session.user.username !== instance.owner) {
      res.statusCode = 403;
      res.send({'errorMessage': 'You\'re not allowed to update this Job'});
      return;
    }
    instance.changes = '';
    instance.changes = JSON.stringify(instance.toSimplification());
    await instance.save();
    res.statusCode = 200;
    res.send(instance.toSimplification());

  } else {
    res.statusCode = 403;
    res.send({'errorMessage': 'You\'re not allowed to update a Job'});
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
    if (req.session.user.type !== 0) {
      req.body.approved = instance.approved;
    }
    // Owner stays the same
    req.body.owner = instance.owner;
    instance.setChanges(req.body);
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
