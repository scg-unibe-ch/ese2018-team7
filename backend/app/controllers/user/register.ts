import {Usergroup} from '../../enums/usergroup.enum';
import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';

/**
 * @swagger
 *
 * /login:
 *   post:
 *     tags:
 *     - user
 *     summary: Register new user
 *     description: Register a new user, if not logged in as administrator, then it will be an employer
 *     operationId: user_register
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: user
 *       description: User and Company object
 *       required: true
 *       schema:
 *         type: object
 *         properties:
 *           username:
 *             type: string
 *           password:
 *             type: string
 *           email:
 *             type: string
 *             format: email address
 *           type:
 *             type: integer
 *           enabled:
 *             type: boolean
 *           company:
 *             type: string
 *           logo:
 *             type: string
 *             format: base64
 *     responses:
 *       200:
 *         description: Successful registered user
 *         schema:
 *           $ref: '#/definitions/message'
 *       403:
 *         description: Username or Password empty, User already exists
 *         schema:
 *           $ref: '#/definitions/message'
 *
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  // if loggedin admin register then new is admin, else employer
  if (req.session != null && req.session.user != null && req.session.user.type <= Usergroup.administrator) {

    req.body.enabled = 'true';

  } else {

    req.body.type = Usergroup.employer;
    req.body.enabled = 'false';

  }

  if (req.body.username === '') {

    res.status(403).send(Message.error.emptyUsernameNotAllowed);
    return;

  }
  if (req.body.pass === '') {

    res.status(403).send(Message.error.emptyPasswordNotAllowed);
    return;

  }

  // Get user from Request
  const instance = new User();

  instance.createUser({
    'username': req.body.username.toLowerCase(),
    'password': req.body.password,
    'type': req.body.type,
    'enabled': req.body.enabled
  });


  // Check if that user already exists
  const checkInstance = await User.findByPrimary(req.body.username.toLowerCase());

  // Reject if user exists
  if (checkInstance != null) {

    res.status(403).send(Message.error.userAlreadyExist);
    return;

  }

  // Else save the new user
  await instance.save();

  // Save Company if necessary
  if (req.body.company != null) {

    const company = new Company();
    company.createCompany({
      'username': req.body.username.toLowerCase(),
      'name': req.body.company,
      'email': req.body.email,
      'logo': req.body.logo
    });

    // Save Company
    await company.save();

  }

  if (req.session != null && req.session.user != null && req.session.user.type <= Usergroup.administrator) {
    res.status(200).send(Message.success.userCreated);
  } else {
    res.status(200).send(Message.success.userRegisteredNeedsApproval);
  }

});
