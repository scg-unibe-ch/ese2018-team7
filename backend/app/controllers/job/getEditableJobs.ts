import {Usergroup} from '../../enums/usergroup.enum';
import {Job} from '../../models/job.model';
import {Sequelize} from 'sequelize-typescript';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  // Set filter to allow only specific access

  let options = {where: Sequelize.and(
      {owner: req.session.user.username},
    )};

  if (req.session.user.type <= Usergroup.moderator) {
      options = {where: Sequelize.and(
          {'workload': {gte: 0}},
        )};
  }

  const instances = await Job.findAll(options);

  res.status(200).send(instances.map((e: any) => {

    const cValue = JSON.parse(e['dataValues']['changes']);

    let changed = false;

    // Apply changes for user
    for (const key in e['dataValues']) {

      if (e['dataValues'].hasOwnProperty(key)) {

        if (cValue[key] != null && e['dataValues'][key] !== cValue[key]) {

          e['dataValues'][key] = cValue[key];
          changed = true;

        }

      }

    }

    const val = e.getSimpleJob();
    val['changed'] = changed;

    return val;

  }));

});
