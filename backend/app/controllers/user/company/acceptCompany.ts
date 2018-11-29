import {Company} from '../../../models/company.model';
import {Response} from 'express';
import {Request} from '../../../interfaces/request.interface';
import {asyncRoute} from '../../../helper/async.helper';
import {Message} from '../../../enums/message.enum';

/**
 * @swagger
 *
 * /login/company/accept:
 *   get:
 *     tags:
 *     - company
 *     summary: Accept changes of a Company
 *     description: Accept changes of a Company
 *     operationId: user_company_accept
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
 *           $ref: '#/definitions/message'
 *       403:
 *        description: Permission denied, if not Administrator or Moderator
 *        schema:
 *          $ref: '#/definitions/message'
 *       404:
 *         description: If user doesn't have a company
 *         schema:
 *           $ref: '#/definitions/message'
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = await Company.findByPrimary(req.body.username);

  if (instance == null) {

    res.status(404).send(Message.error.notFound);
    return;

  }

  instance.applyChanges();

  await instance.save();

  res.status(200).send(Message.success.success);

});
