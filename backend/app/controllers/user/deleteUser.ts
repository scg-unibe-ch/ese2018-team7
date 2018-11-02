import {User} from '../../models/user.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = await User.findByPrimary(req.params.username);

  if (instance == null) {

    res.status(404).send(Message.error.notFound);
    return;

  }

  await instance.destroy();

  res.status(200).send();

});
