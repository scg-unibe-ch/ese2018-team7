import {Job} from '../../models/job.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';
import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const id = parseInt(req.params.id);

  const instance = await Job.findById(id, {include: [{
      model: User,
      include: [{
        model: Company,
      }]
    }]});

  if (instance == null) {

    res.status(404).send(Message.error.notFound);
    return;

  }

  // instance.approved = true;
  instance.addChanges({'approved': true});
  instance.applyChanges();

  await instance.save();

  res.status(200).send(instance.getJobForEdit());

});
