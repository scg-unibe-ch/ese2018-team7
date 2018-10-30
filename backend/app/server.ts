// import everything from express and assign it to the express variable
import * as Express from 'express';
import * as ExpressSession from 'express-session';
//
const cors = require('cors');

// import all the controllers. If you add a new controller, make sure to import it here as well.
import {Sequelize} from 'sequelize-typescript';
import {Job} from './models/job.model';
import {User} from './models/user.model';
import {Company} from './models/company.model';
import {Usergroup} from './enums/usergroup.enum';
import {MainController} from './controllers';

// Set Database
const sequelize =  new Sequelize({
  database: 'development',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: 'db.sqlite'
});

// Add Models to DB
sequelize.addModels([Job, User, Company]);

// create a new express application instance
const app: Express.Application = Express();
app.use(Express.json());

// Create new express session data
app.use(ExpressSession({
  secret: 'omfg, its a secret!',
  resave: false,
  saveUninitialized: true
}));

app.use(cors(function (req: any, callback: Function) {

  callback(null, {
    origin: true,
    credentials: true,
  });

}));

// define the port the express app will listen on
let port = 3000;
if (process.env.PORT !== undefined) {
  port = parseInt(process.env.PORT);
}

// Add mai controller
app.use('/', MainController);

// Initialize first admin with default credentials
async function initDefaultAdmin() {

  try {

    const users = await User.findAll();

    if (users.length === 0) {

      const u = new User();
      u.createUser({'username': 'admin', 'password': 'admin', 'type': Usergroup.administrator, 'enabled': 'true'});
      await u.save();

    }

  } catch (err) {

    console.log('Error: ', err.message);

  }

}

// Sync DB and start server after that
sequelize.sync().then(() => {

  initDefaultAdmin();

  // start serving the application on the given port
  app.listen(port, () => {
    // success callback, log something to console as soon as the application has started
    console.log(`Listening at http://localhost:${port}/`);
  });

});
