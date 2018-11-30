import {User} from '../../models/user.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';

/**
 * @swagger
 *
 * /login/accept:
 *   put:
 *     tags:
 *     - user
 *     summary: Accept new user
 *     description: Accept new user
 *     operationId: user_accept
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: username
 *       description: Username of user that should be accepted
 *       required: true
 *       schema:
 *         type: object
 *         properties:
 *           username:
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
 *         description: If User doesn't exist
 *         schema:
 *           $ref: '#/definitions/message'
 */
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
