import {Job} from '../../models/job.model';
import {Response} from 'express';
import {Request} from '../../interfaces/request.interface';
import {asyncRoute} from '../../helper/async.helper';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const id = parseInt(req.params.id);

  const instance = await Job.findById(id);

  if (instance == null) {

    res.status(404).send({'errorMessage': 'not found'});
    return;

  }

  // instance.approved = true;
  instance.addChanges({'approved': true});
  instance.applyChanges();

  await instance.save();

  res.status(200).send(instance.getJobWithAdditionalDetails());

});
