import {Job} from '../../models/job.model';
import {Usergroup} from '../../enums/usergroup.enum';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';
import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = await Job.findById(req.params.id, {include: [{
      model: User,
      include: [{
        model: Company,
      }]
    }]});

  if (instance == null) {

    res.status(404).send(Message.error.notFound);
    return;

  }

  if (req.session.user.username !== instance.owner && req.session.user.type > Usergroup.moderator) {

    res.status(403).send(Message.error.permissionDenied);
    return;

  }

  instance.changes = instance.getJSONforChange();

  await instance.save();

  res.status(200).send(instance.getJobForEdit());

});
