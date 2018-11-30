import {Job} from '../../models/job.model';
import {Usergroup} from '../../enums/usergroup.enum';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';
import {Message} from '../../enums/message.enum';

/**
 * @swagger
 *
 * /jobs:
 *   post:
 *     tags:
 *     - job
 *     summary: Add job
 *     description: Add a job
 *     operationId: job_add
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: job
 *       description: Job object
 *       required: true
 *       schema:
 *         type: object
 *         properties:
 *           title:
 *             type: string
 *           department:
 *             type: string
 *           placeOfWork:
 *             type: string
 *           contractType:
 *             type: string
 *           startOfWork:
 *             type: integer
 *             format: timestamp
 *           endOfWork:
 *             type: integer
 *             format: timestamp
 *             description: 0 if contractType is unlimited
 *           workload:
 *             type: integer
 *           salary:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *               period:
 *                 type: string
 *                 description: month, hour, job or other
 *           shortDescription:
 *             type: string
 *           description:
 *             type: string
 *             description: Markdown text
 *           skills:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *           phone:
 *             type: string
 *             description: formatted phone number
 *           email:
 *             type: string
 *           website:
 *             type: string
 *           contactInfo:
 *             type: string
 *           startOfPublication:
 *             type: integer
 *             format: timestamp
 *           endOfPublication:
 *             type: integer
 *             format: timestamp
 *     responses:
 *       200:
 *         description: The created Job
 *         schema:
 *           '$ref: #/definitions/getJobForEdit'
 *       403:
 *         description: Permission denied, if not logged in as Employer
 *         schema:
 *           '$ref: #/definitions/message'
 *       404:
 *         description: if unable to create Job
 *         schema:
 *           '$ref: #/definitions/message'
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = new Job();

  if (req.body['email'] == null || req.body['email'] === '') {
    req.body['email'] = req.session.user.company[0].email;
  }

  req.body['owner'] = req.session.user.username;
  req.body['approved'] = req.session.user.type <= Usergroup.moderator ;

  instance.createJob(req.body);


  await instance.save();

  const returnInstance = await Job.findById(instance.id, {include: [{
      model: User,
      include: [{
        model: Company,
      }]
    }]});
  if (returnInstance == null) {
    res.status(404).send(Message.error.notFound);
    return;
  }
  res.status(200).send(returnInstance.getJobForEdit());

});
