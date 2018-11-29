import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';

/**
 * @swagger
 *
 * /login/edit:
 *   get:
 *     tags:
 *     - user
 *     summary: Get User for editing
 *     description: Get User for editing, if not logged in as administrator or moderator then returns 403
 *     operationId: user_edit
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: Array of users
 *         schema:
 *           $ref: '#definitions/userGetAdminEditDetails'
 *       403:
 *         description: Not logged in as administator or moderator
 *         schema:
 *           $ref: '#/definitions/message'
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instances = await User.findAll({include: [{model: Company}]});

  res.status(200).send(instances.map(e => e.getAdminEditDetails()));

});
