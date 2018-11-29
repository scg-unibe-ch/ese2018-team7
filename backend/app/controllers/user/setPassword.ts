import {User} from '../../models/user.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';

/**
 * @swagger
 *
 * /login/setPassword:
 *   put:
 *     tags:
 *     - user
 *     summary: Set new password for another user
 *     description: Set new password for another user
 *     operationId: user_set_password
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       description: Username and Password
 *       required: true
 *       schema:
 *         type: object
 *         properties:
 *           username:
 *             type: string
 *           password:
 *             type: string
 *     responses:
 *       200:
 *         description: Success Message
 *         schema:
 *           $ref: '#/definitions/message'
 *       403:
 *         description: Permission denied, if not Administrator or Moderator
 *         schema:
 *           $ref: '#/definitions/message'
 *       404:
 *         description: If User doesn't exist, Password is empty or User has higher level
 *         schema:
 *           $ref: '#/definitions/message'
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = await User.findByPrimary(req.body.username);

  if (instance == null) {

    res.status(404).send(Message.error.notFound);
    return;

  }

  if (req.body.password == null || req.body.password === '') {

    res.status(404).send(Message.error.emptyPasswordNotAllowed);
    return;

  }

  if (instance.type < req.session.user.type) {

    res.status(404).send(Message.error.permissionDeniedChangePasswordHigherLevel);
    return;

  }

  instance.setPassword(req.body.password);
  await instance.save();

  res.status(200).send(Message.success.success);

});
