import {Company} from '../../../models/company.model';
import {Response} from 'express';
import {Request} from '../../../interfaces/request.interface';
import {asyncRoute} from '../../../helper/async.helper';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  let instance = await Company.findByPrimary(req.session.user.username);

  // Create Fake Company for admins/mods...
  if (instance == null) {

    instance = new Company();
    instance.createCompany({'username': req.session.user.username, 'name': '', 'logo': '', 'unapprovedChanges': false});

  }

  res.status(200).send(instance.forEdit());

});
