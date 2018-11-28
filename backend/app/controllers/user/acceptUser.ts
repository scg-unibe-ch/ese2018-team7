import {User} from '../../models/user.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = await User.findByPrimary(req.body.username);

  if (instance == null) {

    res.status(404).send(Message.error.notFound);
    return;

  }

  instance.enabled = true;

  await instance.save();

  res.status(200).send(Message.success.success);

});
