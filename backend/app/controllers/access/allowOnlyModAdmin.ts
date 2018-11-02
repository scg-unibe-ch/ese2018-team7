import {Usergroup} from '../../enums/usergroup.enum';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {Message} from '../../enums/message.enum';

module.exports = (req: Request, res: Response, next: Function) => {

  if (req.session == null || req.session.user == null || req.session.user.type > Usergroup.moderator) {
    res.status(403).send(Message.error.permissionDenied);
    return;
  }
  next();
};
