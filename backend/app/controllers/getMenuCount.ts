import {User} from '../models/user.model';
import {Response} from 'express';
import {Request} from '../interfaces/request.interface';
import {asyncRoute} from '../helper/async.helper';
import {Job} from '../models/job.model';
import {Usergroup} from '../enums/usergroup.enum';
import {Company} from '../models/company.model';

/**
 * @swagger
 *
 * /menuCount:
 *   get:
 *     tags:
 *     - miscellaneous
 *     summary: Get number of jobs and users, needing attention
 *     description: Returns the number of jobs and users, that need special attention
 *     operationId: getMenuCount
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: object with number of jobs and users needing attention
 *         schema:
 *           type: object
 *           properties:
 *             jobs:
 *               type: integer
 *             users:
 *               type: integer
 *
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  const jobInstances = await Job.findAll({
    include: [{
      model: User,
      where: {suspended: false},
    }]
  });
  let jobCounter = 0;

  jobInstances.map((instance) => {
    if (req.session.user.type > Usergroup.moderator && instance.owner === req.session.user.username) {
      ++jobCounter;
    } else if (req.session.user.type <= Usergroup.moderator) {
      if (!instance.approved || instance.getJSONForChange() !== instance.changes) {
        ++jobCounter;
      }
    }
  });

  const userInstances = await User.findAll({
    where: {suspended: false},
    include: [{
      model: Company,
    }]
  });
  let userCounter = 0;
  if (req.session.user.type <= Usergroup.moderator) {
    userInstances.map((instance) => {
      if (!instance.enabled || (instance.company[0] != null && instance.company[0].getJSONForChange() !== instance.company[0].changes)) {
        ++userCounter;
      }
    });
  }

  console.log('Nr of jobs for ' + req.session.user.username + ' is ' + jobCounter);
  console.log('Nr of users for ' + req.session.user.username + ' is ' + userCounter);

  res.status(200).send({'jobs': jobCounter, 'users': userCounter});

});
