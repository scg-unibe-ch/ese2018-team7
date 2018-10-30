import {Job} from '../../models/job.model';
import {Sequelize} from 'sequelize-typescript';
import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  // if the user wants to search

  // Add % to create full text search on title
  const title = (req.query.title != null) ? '%' + req.query.title + '%' : '%';

  // Add % to create full text search on company and departement
  const company = (req.query.company != null) ? '%' + req.query.company + '%' : '%';
  const department = (req.query.department != null) ? '%' + req.query.department + '%' : '%';

  // Default start after is 1.1.1970
  const startAfter = (req.query.startAfter != null) ? req.query.startAfter : 0;

  // Default start before is now + 10 years
  const startBefore = (req.query.startBefore != null) ? req.query.startBefore :
    Math.floor(new Date(new Date().setFullYear(new Date().getFullYear() + 10)).getTime() / 1000);

  // Default Workload is >= 0 and <= 100
  const workloadGt = (req.query.workloadGt != null) ? req.query.workloadGt : 0;
  const workloadLt = (req.query.workloadLt != null) ? req.query.workloadLt : 100;

  // now query data according to the defined filter
  const instances = await Job.findAll({
    where: Sequelize.and(
      {'title': {like: title}},
      {'department': {like: department}},
      {'startOfWork': {gte: startAfter}},
      {'startOfWork': {lte: startBefore}},
      {'workload': {gte: workloadGt}},
      {'workload': {lte: workloadLt}},
      {approved: true},
      {startOfPublication: {lte: Math.floor(Date.now() / 1000)}},
      {endOfPublication: {gte: Math.floor(Date.now() / 1000)}},
    ),
    include: [{
      model: User,
      where: {suspended: false},
      include: [{
        model: Company,
        where: {name: {like: company}},
      }]
    }]
  });

  res.status(200).send(instances.map( e => e.getWithCompanyData()));

});
