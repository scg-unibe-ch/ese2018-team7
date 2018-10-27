import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instances = await User.findAll({include: [{model: Company}]});

  res.status(200).send(instances.map(e => e.getAdminEditDetails()));

});
