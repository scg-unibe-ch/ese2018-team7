
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  req.session.destroy((err: any) => {console.error(err); });
  res.status(200).send(Message.success.userLoggedOut);

});
