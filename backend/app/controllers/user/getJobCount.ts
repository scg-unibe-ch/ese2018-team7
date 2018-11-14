import {User} from '../../models/user.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';
import {Job} from '../../models/job.model';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = await User.findByPrimary(req.body.username, {include: [{
    model: Job,
    }]});

  if (instance == null) {
    res.status(404).send(Message.error.notFound);
    return;
  }

  res.status(200).send(instance.getJobCount());

});
