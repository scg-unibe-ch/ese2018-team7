import {User} from '../../models/user.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';

/**
 * @swagger
 *
 * /login/suspend:
 *   put:
 *     tags:
 *     - user
 *     summary: Suspend a user
 *     description: Suspend a user
 *     operationId: user_suspend
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       description: Username
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
 *           type: object
 *           properties:
 *             suspended:
 *               type: boolean
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

  instance.suspended = !instance.suspended;

  await instance.save();
  res.status(200).send({'suspended': instance.suspended});

});
