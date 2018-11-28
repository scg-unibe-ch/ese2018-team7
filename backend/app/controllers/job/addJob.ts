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

  if (req.body['email'] == null || req.body['email'] === '') {
    req.body['email'] = req.session.user.email;
  }

  req.body['owner'] = req.session.user.username;
  req.body['approved'] = req.session.user.type <= Usergroup.moderator ;

  instance.createJob(req.body);


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
