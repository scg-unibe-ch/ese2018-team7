import {Router, Request, Response} from 'express';
import {User} from '../models/user.model';

const router: Router = Router();

// Just for debugging... -> Get all users
router.get('/', async (req: Request, res: Response) => {
  const instances = await User.findAll();
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});

// Checks if the user is logged in
router.get('/check', async (req: Request, res: Response) => {
  if (req.session != null && req.session.user != null) {
    res.statusCode = 200;
    res.send({'message': 'Session ok', 'value': 'true'});
  } else {
    res.statusCode = 200;
    res.send({'message': 'Session not ok', 'value': 'false'});
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
      'message': 'not found'
    });
    return;
  }
  console.log('User found!');
  if (instance.authentify(req.params.pass)) {
    console.log('password ok!');
      if (req.session) {
        req.session.user = instance;
        req.session.user.password = '';
        res.status(200).send(req.session.user);
      } else {
        res.status(403).send({
          errorMessage: 'Permission denied! - No Session'
        });
        return;
      }

  } else {
      res.status(403).send({
        errorMessage: 'Permission denied!'
      });
      return;
  }

  res.statusCode = 500;
  res.send({errorMessage: 'something failed...'});
});

// Register User
router.post('/', async (req: Request, res: Response) => {

  // Get user from Request
  const instance = new User();
  instance.fromSimplification(req.body);

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

  if (req.session) {
    req.session.user = instance;
    res.status(200).send(
      instance.toSimplification()
    );
  } else {
    res.status(403).send({
      errorMessage: 'Permission denied! - No Session'
    });
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


// Update a user
router.put('/', async (req: Request, res: Response) => {

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
  }
  instance.fromSimplification(req.body);
  await instance.save();
  res.statusCode = 200;
  res.send(instance.toSimplification());
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
  instance.fromSimplification(req.body);
  await instance.destroy();
  res.statusCode = 204;
  res.send();
});

export const UserController: Router = router;
