import {Router, Request, Response} from 'express';
import {Job} from '../models/job.model';
import {Skill} from '../models/skill.model';

const router: Router = Router();
router.get('/', async (req: Request, res: Response) => {
  const jobId = parseInt(req.query.jobId);
  let options = {};
  if (jobId != null) {
    options = {
      include: [{
        model: Job,
        where: {
          id: jobId
        }
      }]
    };
  }
  const instances = await Skill.findAll(options);
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});
router.post('/', async (req: Request, res: Response) => {
  const instance = new Skill();
  instance.fromSimplification(req.body);
  await instance.save();
  res.statusCode = 201;
  res.send(instance.toSimplification());
});
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await Skill.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  res.statusCode = 200;
  res.send(instance.toSimplification());
});
router.put('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await Skill.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  instance.fromSimplification(req.body);
  await instance.save();
  res.statusCode = 200;
  res.send(instance.toSimplification());
});
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await Skill.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  instance.fromSimplification(req.body);
  await instance.destroy();
  res.statusCode = 204;
  res.send();
});

export const SkillController: Router = router;
