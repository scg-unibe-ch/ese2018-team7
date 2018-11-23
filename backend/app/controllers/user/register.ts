import {Usergroup} from '../../enums/usergroup.enum';
import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';

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
    'email': req.body.email,
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
      'username': req.body.username,
      'name': req.body.company,
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
