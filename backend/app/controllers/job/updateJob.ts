import {Job} from '../../models/job.model';
import {Usergroup} from '../../enums/usergroup.enum';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';
import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';

/**
 * @swagger
 *
 * /jobs/{id}:
 *   put:
 *     tags:
 *     - job
 *     summary: Update Job
 *     description: Update one or multiple attributes of a job
 *     operationId: job_update
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Job Id
 *       required: true
 *       type: integer
 *     responses:
 *       200:
 *         description: Job with current data
 *         schema:
 *           $ref: '#/definitions/getJobForEdit'
 *       403:
 *         description: Permission denied, if not Administrator, Moderator or Job owner
 *         schema:
 *           $ref: '#/definitions/message'
 *       404:
 *         description: If job not found
 *         schema:
 *           $ref: '#/definitions/message'
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  const id = parseInt(req.params.id);
  const instance = await Job.findById(id, {include: [{
      model: User,
      include: [{
        model: Company,
      }]
    }]});
  if (instance == null) {

    res.status(404).send(Message.error.notFound);
    return;

  }

  if (req.session.user.username !== instance.owner && req.session.user.type > Usergroup.moderator) {

    res.status(403).send(Message.error.permissionDenied);
    return;

  }

  // Employer can't approve Job
  if (req.session.user.type > Usergroup.moderator) {

    req.body.approved = instance.approved;

  }

  // Owner stays the same
  req.body.owner = instance.owner;

  instance.addChanges(req.body);

  await instance.save();

  res.status(200).send(instance.getJobForEdit());

});
