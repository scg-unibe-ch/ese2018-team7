import {Company} from '../../../models/company.model';
import {Response} from 'express';
import {Request} from '../../../interfaces/request.interface';
import {asyncRoute} from '../../../helper/async.helper';

/**
 * @swagger
 *
 * /login/company:
 *   get:
 *     tags:
 *     - company
 *     summary: Get your own Company
 *     description: Get your own Company
 *     operationId: user_company_get
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: Your Company
 *         schema:
 *           $ref: '#/definitions/company'
 *       403:
 *         description: 'Permission denied, if not logged in'
 *         schema:
 *           $ref: '#/definitions/message'
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  let instance = await Company.findByPrimary(req.session.user.username);

  // Create Fake Company for admins/mods...
  if (instance == null) {

    instance = new Company();
    instance.createCompany({'username': req.session.user.username, 'name': '', 'email': '', 'logo': '', 'unapprovedChanges': false});

  }

  res.status(200).send(instance.forEdit());

});
