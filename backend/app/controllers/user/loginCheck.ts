
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  if (req.session != null && req.session.user != null) {

    res.status(200).send({'message': 'Session ok', 'value': 'true', 'type': req.session.user.type , 'username': req.session.user.username});

  } else {

    res.status(200).send({'message': 'Session not ok', 'value': 'false'});

  }

});
