import {User} from '../../models/user.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';
import {Message} from '../../enums/message.enum';
import {Sequelize} from 'sequelize-typescript';
import {Job} from '../../models/job.model';

/**
 * @swagger
 *
 * /login/{username}:
 *   delete:
 *     tags:
 *     - user
 *     summary: Delete user
 *     description: Delete a user
 *     operationId: user_delete
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: username
 *       in: path
 *       description: Username of user that should be deleted
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Success Message
 *         schema:
 *           type: object
 *           properties:
 *             suspended:
 *               type: boolean
 *       403:
 *         description: Permission denied, if not Administrator or Moderator
 *         schema:
 *           $ref: '#/definitions/message'
 *       404:
 *         description: If User doesn't exist or still has jobs
 *         schema:
 *           $ref: '#/definitions/message'
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  const instance = await User.findByPrimary(req.params.username);

  if (instance == null) {

    res.status(404).send(Message.error.notFound);
    return;

  }

  const jobs = await Job.findAll( {
    where: Sequelize.and(
      {'owner': {like: instance.username}})});

  if (jobs !== null && jobs.length !== 0) {
    res.status(404).send(Message.error.userHasJobs);
    return;
  }

  await instance.destroy();
  res.status(200).send(Message.success.success);

});
