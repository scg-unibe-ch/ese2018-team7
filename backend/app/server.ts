// import everything from express and assign it to the express variable
import * as Express from 'express';
import * as ExpressSession from 'express-session';

export interface Request extends Express.Request {
  session: any;
}

// import all the controllers. If you add a new controller, make sure to import it here as well.
import {JobController, UserController} from './controllers';
import {Sequelize} from 'sequelize-typescript';
import {Job} from './models/job.model';
import {User} from './models/user.model';
import {Company} from './models/company.model';
import {Usergroup} from './enums/usergroup.enum';

const sequelize =  new Sequelize({
  database: 'development',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: 'db.sqlite'
});
sequelize.addModels([Job, User, Company]);

// create a new express application instance
const app: Express.Application = Express();
app.use(Express.json());

app.use(ExpressSession({
  secret: 'omfg, its a secret!',
resave: false,
  saveUninitialized: true
}));

// define the port the express app will listen on
let port = 3000;
if (process.env.PORT !== undefined) {
  port = parseInt(process.env.PORT);
}

app.use(function (req, res, next) {
  // Mustn't be '*' because then credentials are not working! need to be exact protocol, hostname and port
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Must be explicit, because * seems not to be allowed
  res.header('Access-Control-Allow-Methods', '"GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/jobs', JobController);
app.use('/login', UserController);

// Initialize first admin with default credentials
async function initDefaultAdmin() {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      const u = new User();
      u.fromSimplification({'username': 'admin', 'password': 'admin', 'type': Usergroup.administrator, 'enabled': 'true'});
      await u.save();
    }
  } catch (err) {
    console.log('Error: ', err.message);
  }
}
sequelize.sync().then(() => {

  initDefaultAdmin();

// start serving the application on the given port
  app.listen(port, () => {
    // success callback, log something to console as soon as the application has started
    console.log(`Listening at http://localhost:${port}/`);
  });
});
