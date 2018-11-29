
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';

/**
 * @swagger
 *
 * /login/logout:
 *   get:
 *     tags:
 *     - user
 *     summary: Loggout the user
 *     description: Loggout the user
 *     operationId: user_logout
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: Success Message
 *         schema:
 *           $ref: '#/definitions/message'
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  req.session.destroy((err: any) => {console.error(err); });
  res.status(200).send(Message.success.userLoggedOut);

});
