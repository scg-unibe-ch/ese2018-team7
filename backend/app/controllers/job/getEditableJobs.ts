import {Usergroup} from '../../enums/usergroup.enum';
import {Job} from '../../models/job.model';
import {Sequelize} from 'sequelize-typescript';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  // Set filter to allow only specific access

  let options = {where: Sequelize.and(
      {owner: req.session.user.username},
    ),
    include: [{
      model: User,
      where: {suspended: false},
      include: [{
        model: Company,
      }]
    }]};

  if (req.session.user.type <= Usergroup.moderator) {
      options = {where: Sequelize.and(
          {'workload': {gte: 0}},
        ),
        include: [{
      model: User,
      where: {suspended: false},
      include: [{
        model: Company,
      }]
    }]};
  }

  const instances = await Job.findAll(options);

  res.status(200).send(instances.map(e => e.getJobForEdit()));

});
