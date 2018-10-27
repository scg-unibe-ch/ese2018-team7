import {Company} from '../../../models/company.model';
import {Response} from 'express';
import {Request} from '../../../interfaces/request.interface';
import {asyncRoute} from '../../../helper/async.helper';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = await Company.findByPrimary(req.session.user.username);

  if (instance == null) {

    res.status(404).send({'errorMessage': 'not found'});
    return;

  }

  instance.changes = '';
  instance.changes = JSON.stringify(instance);

  await instance.save();

  res.status(200).send(instance);

});
