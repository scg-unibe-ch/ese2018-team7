import {Router, Request, Response} from 'express';
import {User} from '../models/user.model';
import {Company} from '../models/company.model';
import {Usergroup} from '../enums/usergroup.enum';

const router: Router = Router();

// Just for debugging... -> Get all users
// TODO
router.get('/', async (req: Request, res: Response) => {
  const instances = await User.findAll({include: [{model: Company}]});
  res.statusCode = 200;
  res.send(instances.map(e => JSON.stringify(e)));
});

// Get all users to edit
router.get('/edit', async (req: Request, res: Response) => {

  // Only allow Mods or admins
  if (req.session != null && req.session.user != null && req.session.user.type <= Usergroup.moderator) {

    const instances = await User.findAll({include: [{model: Company}]});
    res.statusCode = 200;
    res.send(instances.map(e => e.getAdminEditDetails()));

  } else {
    res.statusCode = 403;
    res.send({'errorMessage': 'Permission denied!'});
  }
});


// Checks if the user is logged in
router.get('/check', async (req: Request, res: Response) => {
  if (req.session != null && req.session.user != null) {
    res.statusCode = 200;
    res.send({'message': 'Session ok', 'value': 'true', 'type': req.session.user.type , 'username': req.session.user.username});
  } else {
    res.statusCode = 200;
    res.send({'message': 'Session not ok', 'value': 'false'});
  }
});

// Checks if the user is logged in
router.get('/company', async (req: Request, res: Response) => {
  if (req.session != null && req.session.user != null) {

    let instance = await Company.findByPrimary(req.session.user.username);

    // Create Fake Company for admins/mods...
    if (instance == null) {
      instance = new Company();
      instance.fromSimplification({'username': req.session.user.username, 'name': '', 'logo': '', 'unapprovedchanges': false});
    }

    res.statusCode = 200;
    res.send(instance.forEdit());
  } else {
    res.statusCode = 404;
    res.send({'errorMessage': 'Permission denied!'});
  }
});

// Logout a user
router.get('/logout', async (req: Request, res: Response) => {
  if (req.session != null && req.session.user != null) {
    req.session.destroy(err => {console.error(err); });
    res.statusCode = 200;
    res.send({'message': 'logged out successfully', 'value': 'true'});
  } else {
    res.statusCode = 403;
    res.send({'message': 'not logged in', 'value': 'false'});
  }
});

// Login a user
router.get('/:user/:pass', async (req: Request, res: Response) => {
  console.log(req.params);
  const username = req.params.user;
  const instance = await User.findByPrimary(username);
  if (instance == null) {
    console.log('Couldn\'t find login: ' + username);
    res.statusCode = 404;
    res.json({
      'errorMessage': 'Permission denied! - User not found'
    });
    return;
  }
  console.log('User found!');

  if (!instance.enabled) {
    console.log('User not enabled');
    res.status(403).send({
      'errorMessage': 'Permission denied! - User not approved by administrator!'
    });
    return;
  } else if (instance.suspended) {
    console.log('User suspended');
    res.status(403).send({
      'errorMessage': 'Permission denied! - User suspended!'
    });
    return;
  }

  if (instance.authentify(req.params.pass)) {
    console.log('password ok!');
      if (req.session) {
        req.session.user = instance;
        req.session.user.password = '';
        res.status(200).send(req.session.user);
        return;
      } else {
        res.status(403).send({
          errorMessage: 'Permission denied! - Problem creating session'
        });
        return;
      }

  } else {
      res.status(403).send({
        errorMessage: 'Permission denied! - Wrong Username / Password'
      });
      return;
  }
});

// Register User
router.post('/', async (req: Request, res: Response) => {
  console.log('Register user: ' + req.body);

  // if loggedin admin register then new is admin, else employer
  if (req.session != null && req.session.user != null && req.session.user.type <= Usergroup.administrator) {
    req.body.enabled = 'true';
  } else {
    req.body.type = Usergroup.employer;
    req.body.enabled = 'false';
  }

  // Get user from Request
  const instance = new User();
  instance.fromSimplification({
    'username': req.body.username,
    'password': req.body.password,
    'type': req.body.type,
    'enabled': req.body.enabled
  });


  // Check if that user already exists
  const checkInstance = await User.findByPrimary(req.body.username);

  // Reject if user exists
  if (checkInstance != null) {
    console.log('User \'' + req.body.username + '\' already exists!');
    res.statusCode = 403;
    res.json({
      'message': 'User \'' + req.body.username + '\' already exists!'
    });
    return;
  }

  // Else save the new user
  await instance.save();

  // Save Company if necessary
  if (req.body.company != null) {
    const company = new Company();
    company.fromSimplification({
      'username': req.body.username,
      'name': req.body.company,
      'logo': req.body.logo
    });
    company.changes = JSON.stringify(company);

    // Save Company
    await company.save();

  }

  if (req.session != null && req.session.user != null && req.session.user.type <= Usergroup.administrator) {
    res.status(200).send(
      {'message': 'User created'}
    );
  } else {
    res.status(200).send(
      {'message': 'User registered, wait until a moderator approved your accout'}
    );
  }

});

// set new Password
router.put('/password', async (req: Request, res: Response) => {

  // if not logged in cant change
  if (req.session == null) {
    res.status(403).send({
      errorMessage: 'Permission denied! - No Session'
    });
    return;
  }
  const instance = await User.findByPrimary(req.session.user.username);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  } else if (req.body.password == null || req.body.password === '') {
    res.statusCode = 404;
    res.json({
      'message': 'no password is not allowed'
    });
    return;
  }

  instance.setPassword(req.body.password);
  await instance.save();

  res.statusCode = 200;
  res.send({'value': 'true'});
});

// set new Password by admin or mod
router.put('/setPassword', async (req: Request, res: Response) => {

  // if not logged in cant change
  if (req.session == null) {
    res.status(403).send({
      errorMessage: 'Permission denied! - No Session'
    });
    return;
  } else if (req.session.user.type > Usergroup.moderator) {
    res.status(403).send({
      errorMessage: 'Permission denied!'
    });
    return;
  }
  const instance = await User.findByPrimary(req.body.username);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  } else if (req.body.password == null || req.body.password === '') {
    res.statusCode = 404;
    res.json({
      'message': 'no password is not allowed'
    });
    return;
  } else if (instance.type < req.session.user.type) {
    res.statusCode = 404;
    res.json({
      'message': 'not allowed to change password of a higher Level'
    });
    return;
  }

  instance.setPassword(req.body.password);
  await instance.save();

  res.statusCode = 200;
  res.send({'value': 'true'});
});

// Enable a user
router.put('/accept', async (req: Request, res: Response) => {

  // if not logged in cant change
  if (req.session == null) {
    res.status(403).send({
      errorMessage: 'Permission denied! - No Session'
    });
    return;
  } else if (req.session.user.type > Usergroup.moderator) {
    res.status(403).send({
      errorMessage: 'Permission denied!'
    });
    return;
  }
  const instance = await User.findByPrimary(req.body.username);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  instance.enable();
  await instance.save();
  res.statusCode = 200;
  res.send();
});

// Enable a user
router.put('/apply', async (req: Request, res: Response) => {

  // if not logged in cant change
  if (req.session == null) {
    res.status(403).send({
      errorMessage: 'Permission denied! - No Session'
    });
    return;
  } else if (req.session.user.type > Usergroup.moderator) {
    res.status(403).send({
      errorMessage: 'Permission denied!'
    });
    return;
  }
  const instance = await Company.findByPrimary(req.body.username);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }

  instance.applyChanges();
  await instance.save();
  res.statusCode = 200;
  res.send();
});

// Suspend a user
router.put('/suspend', async (req: Request, res: Response) => {

  // if not logged in cant change
  if (req.session == null) {
    res.status(403).send({
      errorMessage: 'Permission denied! - No Session'
    });
    return;
  } else if (req.session.user.type > Usergroup.moderator) {
    res.status(403).send({
      errorMessage: 'Permission denied!'
    });
    return;
  }
  const instance = await User.findByPrimary(req.body.username);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  instance.suspend(!instance.suspended);
  await instance.save();
  res.statusCode = 200;
  res.send({'suspended': instance.suspended});
});

// Update Company
router.put('/company', async (req: Request, res: Response) => {

  // if not logged in cant change
  if (req.session == null) {
    res.status(403).send({
      errorMessage: 'Permission denied!'
    });
    return;
  }
  const instance = await Company.findByPrimary(req.session.user.username);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }

  instance.setChanges(req.body);
  await instance.save();
  res.statusCode = 200;
  res.send();
});

// Accept Company
router.put('/company/accept', async (req: Request, res: Response) => {

  // if not logged in cant change
  if (req.session == null || req.session.user == null || req.session.user.type > Usergroup.moderator) {
    res.status(403).send({
      errorMessage: 'Permission denied!'
    });
    return;
  }
  const instance = await Company.findByPrimary(req.body.username);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }

  instance.applyChanges();

  await instance.save();
  res.statusCode = 200;
  res.send();
});

// Reset Company
router.put('/company/reset', async (req: Request, res: Response) => {

  // if not logged in cant change
  if (req.session == null) {
    res.status(403).send({
      errorMessage: 'Permission denied!'
    });
    return;
  }
  const instance = await Company.findByPrimary(req.session.user.username);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }

  instance.changes = '';
  instance.changes = JSON.stringify(instance);
  await instance.save();
  res.statusCode = 200;
  res.send(instance);
});

// Delete user
router.delete('/', async (req: Request, res: Response) => {
  if (req.session == null) {
    res.status(403).send({
      errorMessage: 'Permission denied! - No Session'
    });
    return;
  }
  const instance = await User.findByPrimary(req.session.user.username);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  await instance.destroy();
  res.statusCode = 204;
  res.send();
});

// Delete another user
router.delete('/:username', async (req: Request, res: Response) => {
  if (req.session == null) {
    res.status(403).send({
      errorMessage: 'Permission denied! - No Session'
    });
    return;
  } else if (req.session.user.type > Usergroup.moderator) {
    res.status(403).send({
      errorMessage: 'Permission denied!'
    });
    return;
  }
  const instance = await User.findByPrimary(req.params.username);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  await instance.destroy();
  res.statusCode = 204;
  res.send();
});

export const UserController: Router = router;
