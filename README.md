# ESE 2018 Team 7

This application was developed for the [ESE course at the University of Bern](http://scg.unibe.ch/teaching/ese) in 2018.

Documentation and further textual information can be found in our [project wiki](https://github.com/scg-unibe-ch/ese2018-team7/wiki) and in the README file for the [frontend](https://github.com/scg-unibe-ch/ese2018-team7/tree/master/frontend) and [backend](https://github.com/scg-unibe-ch/ese2018-team7/tree/master/backend).

## Demo
Our Project is currently running on [Heroku](https://ese2018-team7.herokuapp.com/). There you can also find the [frontend documentation](https://ese2018-team7.herokuapp.com/docs) and [backend documentation](https://ese2018-team7-backend.herokuapp.com/docs).

## How to run
Ensure that you have [Node.js](https://nodejs.org/en/), [NPM](https://www.npmjs.com/) and [Git](https://git-scm.com/) installed, then you can run the [startInstallation.sh](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/startInstallation.sh) script. For further runs you can use the [start.sh](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/start.sh) script.

The frontend should open automatically, else you can find it under [localhost:4200](http://localhost:4200).

The backend runs at [localhost:3000](http://localhost:3000), but it should't be necessary to look at this.

The system uses a SQLite Database.

## Technologies
We use a number of different technologies. Some of them are:
- [Typescript](https://www.typescriptlang.org): Everything is written in Typescript
- [Angular 6](https://angular.io/): The frontend is build with Angular
- [Angular Material](https://material.angular.io/): The design is heavily based on Angular Material
- [Moment.js](https://momentjs.com/docs/): All the time/date stuff is managed with Moment
- [Express](https://expressjs.com): The backend is build with Express
- [Express Session](https://github.com/expressjs/session): To handle user login cookies we use Express Session
- [SQLite](https://www.sqlite.org/): Database for this project
- [Sequelize](http://docs.sequelizejs.com/): ORM to connect to the SQLite Database
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js): Library to securely hash your password
- [Swagger](https://github.com/swagger-api/swagger-ui/): To present beautiful backend API documentation we use swagger UI
- [Compodoc](https://compodoc.app/): To present beautiful frontend documentation we use compodoc
- [Webstorm](https://www.jetbrains.com/webstorm/) or [IntelliJ IDEA](https://www.jetbrains.com/idea/) as the [IDE](https://en.wikipedia.org/wiki/Integrated_development_environment)

Angular 6, Angular Material, Moment.js, Express Session, Sequelize, Bcrypt and Compodoc are licensed under the [MIT License](https://spdx.org/licenses/MIT.html).

Typescript and Swagger are licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

Express is licensed under the [Creative Commons Attribution-ShareAlike 3.0 License](https://creativecommons.org/licenses/by-sa/3.0/legalcode).

SQLite is in the public domain.

## Browser
Our application is optimised for use with the [Google Chrome](http://www.google.com/chrome) web browser.

## Licensing
This work is licensed under the [MIT License](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/LICENSE.md).
