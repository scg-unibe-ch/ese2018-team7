import {User} from '../../models/user.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';
import {Company} from '../../models/company.model';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const username = req.params.user.toLowerCase();
  const instance = await User.findByPrimary(username, {include: [{model: Company}]});

  if (instance == null) {

    res.status(403).send(Message.error.permissionDeniedUserNotExist);
    return;

  }

  if (!instance.enabled) {

    res.status(403).send(Message.error.permissionDeniedUserNotApproved);
    return;

  }

  if (instance.suspended) {

    res.status(403).send(Message.error.permissionDeniedUserSuspended);
    return;

  }

  if (instance.authenticate(req.params.pass)) {

    if (req.session) {

      req.session.user = instance;
      req.session.user.password = '';
      res.status(200).send(req.session.user);
      return;

    } else {

      res.status(403).send(Message.error.permissionDeniedSessionProblem);
      return;

    }

  }

  res.status(403).send(Message.error.permissionDeniedWrongPassword);

});
