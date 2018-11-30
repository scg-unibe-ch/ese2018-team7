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
 * /jobs/reset/{id}:
 *   put:
 *     tags:
 *     - job
 *     summary: Reset Job to public version
 *     description: Reset Job to public version
 *     operationId: job_reset
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

  const instance = await Job.findById(req.params.id, {include: [{
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

  instance.changes = instance.getJSONForChange();

  await instance.save();

  res.status(200).send(instance.getJobForEdit());

});
