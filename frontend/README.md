## Frontend

This is the frontend of our application, which is built with Angular and Angular Material design. For more information refer to the main [README](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/README.md) or the [project wiki](https://github.com/scg-unibe-ch/ese2018-team7/wiki).

### How to run
After you run the [start.sh](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/start.sh) script, the frontend should open automatically. If it does not, then open your browser and navigate to [localhost:4200](http://localhost:4200).

### Documentation
In order to view the documentation, you can run the [startFrontendDoc.sh](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/startFrontendDoc.sh) script and then open [localhost:8080](http://localhost:8080), where detailed documentation is shown by Compodoc.

### E2E testing
If you want to run our End-To-End tests you can run `npm run e2e` in the frontend directory but make sure, that you don't have the application already running, because it uses the same port.
