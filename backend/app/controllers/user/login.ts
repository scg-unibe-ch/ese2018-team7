import {User} from '../../models/user.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const username = req.params.user;
  const instance = await User.findByPrimary(username);

  if (instance == null) {

    res.status(404).send({'errorMessage': 'not found'});
    return;

  }

  if (!instance.enabled) {

    res.status(403).send({
      'errorMessage': 'Permission denied! - User not approved by administrator!'
    });
    return;

  }

  if (instance.suspended) {

    res.status(403).send({
      'errorMessage': 'Permission denied! - User suspended!'
    });
    return;

  }

  if (instance.authenticate(req.params.pass)) {

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

  }

  res.status(403).send({
    errorMessage: 'Permission denied! - Wrong Username / Password'
  });

});
