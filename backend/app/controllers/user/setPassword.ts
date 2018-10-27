import {User} from '../../models/user.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = await User.findByPrimary(req.body.username);

  if (instance == null) {

    res.status(404).send({'errorMessage': 'not found'});
    return;

  }

  if (req.body.password == null || req.body.password === '') {

    res.status(404).send({'errorMessage': 'no password is not allowed'});
    return;

  }

  if (instance.type < req.session.user.type) {

    res.status(404).send({'errorMessage': 'not allowed to change password of a higher Level'});
    return;

  }

  instance.setPassword(req.body.password);
  await instance.save();

  res.status(200).send({'value': 'true'});

});
