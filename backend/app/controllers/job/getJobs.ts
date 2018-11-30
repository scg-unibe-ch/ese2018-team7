import {Job} from '../../models/job.model';
import {Sequelize} from 'sequelize-typescript';
import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';

/**
 * @swagger
 *
 * /jobs:
 *   get:
 *     tags:
 *     - job
 *     summary: Get all public jobs according to query
 *     description: Get all public jobs matching the search query
 *     operationId: job_get
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: easy
 *       in: query
 *       description: Easy search field
 *       type: string
 *     - name: title
 *       in: query
 *       description: Title search field
 *       type: string
 *     - name: company
 *       in: query
 *       description: Company name search field
 *       type: string
 *     - name: department
 *       in: query
 *       description: Company Department search field
 *       type: string
 *     - name: startAfter
 *       in: query
 *       description: Job starts after timestamp search field
 *       type: integer
 *     - name: startBefore
 *       in: query
 *       description: Job starts before timestamp search field
 *       type: string
 *     - name: workloadGt
 *       in: query
 *       description: Workload greater or equal than search field
 *       type: string
 *     - name: workloadLt
 *       in: query
 *       description: Workload less or equal than search field
 *       type: string
 *     responses:
 *       200:
 *        description: jobs with company data
 *        schema:
 *          $ref: '#/definitions/getJobWithCompanyData'

 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  // if the user wants to search

  // Add % to create full text search on easy
  const easy = (req.query.easy != null) ? '%' + req.query.easy + '%' : '%';

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
      Sequelize.or(
        {title: {like: easy}},
        Sequelize.fn('`user.company.name` LIKE', easy),
      )
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
