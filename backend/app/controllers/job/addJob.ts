import {Job} from '../../models/job.model';
import {Usergroup} from '../../enums/usergroup.enum';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';
import {Message} from '../../enums/message.enum';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = new Job();
  instance.createJob(req.body);

  // Set the owner
  instance.owner = req.session.user.username;

  // Set approved if an admin or mod added job, and not approved else
  instance.approved = req.session.user.type <= Usergroup.moderator ;

  if (instance.email == null || instance.email === '') {
    instance.email = req.session.user.email;
  }

  await instance.save();

  const returnInstance = await Job.findById(instance.id, {include: [{
      model: User,
      include: [{
        model: Company,
      }]
    }]});
  if (returnInstance == null) {
    res.status(404).send(Message.error.notFound);
    return;
  }
  res.status(200).send(returnInstance.getJobForEdit());

});
