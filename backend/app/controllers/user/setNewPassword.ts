import {User} from '../../models/user.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';

/**
 * @swagger
 *
 * /login/password:
 *   put:
 *     tags:
 *     - user
 *     summary: Set new password for current user
 *     description: Set new password for user that is currently logged in
 *     operationId: user_password
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: password
 *       description: New password
 *       required: true
 *       schema:
 *         type: object
 *         properties:
 *           password:
 *             type: string
 *     responses:
 *       200:
 *         description: Success Message
 *         schema:
 *           $ref: '#/definitions/message'
 *       403:
 *         description: Empty Password
 *         schema:
 *           $ref: '#/definitions/message'
 *       404:
 *         description: Problem with user
 *         schema:
 *           $ref: '#/definitions/message'
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = await User.findByPrimary(req.session.user.username);

  if (instance == null) {

    res.status(404).send(Message.error.notFound);
    return;

  }

  if (req.body.password == null || req.body.password === '') {

    res.status(403).send(Message.error.emptyPasswordNotAllowed);
    return;

  }

  instance.setPassword(req.body.password);
  await instance.save();

  res.status(200).send(Message.success.success);

});
