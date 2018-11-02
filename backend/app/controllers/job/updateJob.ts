import {Job} from '../../models/job.model';
import {Usergroup} from '../../enums/usergroup.enum';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const id = parseInt(req.params.id);
  const instance = await Job.findById(id);
  if (instance == null) {

    res.status(404).send(Message.error.notFound);
    return;

  }

  if (req.session.user.username !== instance.owner && req.session.user.type > Usergroup.moderator) {

    res.status(403).send(Message.error.permissionDenied);
    return;

  }

  // Employer can't approve Job
  if (req.session.user.type > Usergroup.moderator) {

    req.body.approved = instance.approved;

  }

  // Owner stays the same
  req.body.owner = instance.owner;

  instance.addChanges(req.body);

  await instance.save();

  res.status(200).send(instance.getJobWithAdditionalDetails());

});
