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

  // Employer can only delete there own Jobs
  if (req.session.user.username !== instance.owner && req.session.user.type > Usergroup.moderator) {

    res.status(403).send(Message.error.permissionDenied);
    return;

  }

  await instance.destroy();

  res.status(200).send();

});
