import {Company} from '../../../models/company.model';
import {Response} from 'express';
import {Request} from '../../../interfaces/request.interface';
import {asyncRoute} from '../../../helper/async.helper';
import {Message} from '../../../enums/message.enum';

/**
 * @swagger
 *
 * /login/company:
 *   put:
 *     tags:
 *     - company
 *     summary: Update your own Company
 *     description: Update your own Company
 *     operationId: user_company_update
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: company
 *       description: Company object
 *       required: true
 *       schema:
 *         $ref: '#/definitions/company'
 *     responses:
 *       200:
 *         description: Success Message
 *         schema:
 *         $ref: '#/definitions/message'
 *       403:
 *         description: Permission denied, if not logged in
 *         schema:
 *         $ref: '#/definitions/message'
 *       404:
 *         description: If user doesn't have a Company -> only Employer have
 *         schema:
 *         $ref: '#/definitions/message'
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = await Company.findByPrimary(req.session.user.username);

  if (instance == null) {

    res.status(404).send(Message.error.notFound);
    return;

  }

  instance.addChanges(req.body);

  await instance.save();

  res.status(200).send(instance.forEdit());

});
