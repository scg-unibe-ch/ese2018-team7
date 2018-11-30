
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';

/**
 * @swagger
 *
 * /login/check:
 *   get:
 *     tags:
 *     - user
 *     summary: Check login state
 *     description: Checks if you are logged in or not
 *     operationId: user_login_check
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: value and message if logged in and if so then userName and userType
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             value:
 *               type: boolean
 *             type:
 *               type: integer
 *               description: only if value is true
 *             username:
 *               type: string
 *               description: only if value is true
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  if (req.session != null && req.session.user != null) {

    res.status(200).send({'message': 'Session ok', 'value': 'true', 'type': req.session.user.type , 'username': req.session.user.username});

  } else {

    res.status(200).send({'message': 'Session not ok', 'value': 'false'});

  }

});
