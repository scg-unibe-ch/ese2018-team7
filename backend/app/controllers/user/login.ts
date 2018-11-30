import {User} from '../../models/user.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';
import {Company} from '../../models/company.model';

/**
 * @swagger
 *
 * /login/{username}/{password}:
 *   get:
 *     tags:
 *     - user
 *     summary: Log in user
 *     description: Log in with the provided credentials
 *     operationId: user_login
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *       - name: username
 *         in: path
 *         description:
 *         required: true
 *         type: string
 *       - name: password
 *         in: path
 *         description:
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Success Message
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *               description: Always empty
 *             type:
 *               type: integer
 *             enabled:
 *               type: boolean
 *             suspended:
 *               type: boolean
 *       403:
 *         description: Login not successfull
 *         schema:
 *          $ref: '#/definitions/message'
 */
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
