import {Company} from '../../../models/company.model';
import {Response} from 'express';
import {Request} from '../../../interfaces/request.interface';
import {asyncRoute} from '../../../helper/async.helper';
import {Message} from '../../../enums/message.enum';

/**
 * @swagger
 *
 *   /login/company/reset:
 *   put:
 *     tags:
 *     - company
 *     summary: Reset your own Company
 *     description: Reset your own Company
 *     operationId: user_company_reset
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: Your Company
 *         schema:
 *         $ref: '#/definitions/company'
 *       403:
 *         description: Permission denied, if not Loggedin
 *         schema:
 *         $ref: '#/definitions/message'
 *       404:
 *         description: If user doesn't have a company
 *         schema:
 *         $ref: '#/definitions/message'
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = await Company.findByPrimary(req.session.user.username);

  if (instance == null) {

    res.status(404).send(Message.error.notFound);
    return;

  }

  instance.changes = '';
  instance.changes = JSON.stringify(instance);

  await instance.save();

  res.status(200).send(instance);

});
