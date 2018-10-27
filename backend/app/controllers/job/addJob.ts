import {Job} from '../../models/job.model';
import {Usergroup} from '../../enums/usergroup.enum';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = new Job();
  instance.createJob(req.body);

  // Set the owner
  instance.owner = req.session.user.username;

  // Set approved if an admin or mod added job, and not approved else
  instance.approved = req.session.user.type <= Usergroup.moderator ;

  instance.changes = JSON.stringify(req.body);

  await instance.save();
  res.status(200).send(instance.getSimpleJob());

});
