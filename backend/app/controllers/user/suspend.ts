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

  instance.suspended = !instance.suspended;

  await instance.save();
  res.status(200).send({'suspended': instance.suspended});

});
