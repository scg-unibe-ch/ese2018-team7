import {Usergroup} from '../../enums/usergroup.enum';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';

module.exports = (req: Request, res: Response, next: Function) => {

  if (req.session == null || req.session.user == null || req.session.user.type !== Usergroup.employer) {
    res.status(403).send({'errorMessage': 'Permission denied!'});
    return;
  }
  next();
};
