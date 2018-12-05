## Frontend

This is the frontend of our application, which is built with Angular and Angular Material design. For more information refer to the main [README](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/README.md) or the [project wiki](https://github.com/scg-unibe-ch/ese2018-team7/wiki).

### How to run
After you run the [start.sh](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/start.sh) script, the frontend should open automatically. If it does not, then open your browser and navigate to [localhost:4200](http://localhost:4200).

### Documentation
In order to view the documentation, you can run the [startFrontendDoc.sh](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/startFrontendDoc.sh) script and then open [localhost:8080](http://localhost:8080), where detailed documentation is shown by Compodoc.

### E2E testing
If you want to run our End-To-End tests you can run `npm run e2e` in the frontend directory. Make sure you have the backend server already running with our [testing database](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/docs/testing.sqlite) copied into the backend folder and renamed to db.sqlite, otherwise the tests won't work.
Also, keep in mind that protractor is rather unreliable when it comes to consistency. Even though all tests passed during our tests in our environment, we can not guarantee, that the tests will run successfully in your setting.

### Deployment
In [apiInterceptor.ts](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/frontend/src/app/apiInterceptor/apiInterceptor.ts)
change your backend URL from ``{ url: `http://` + window.location.hostname + `:3000${req.url}` `` to ``{ url: `https://serverurl${req.url}` ``

Run `npm build --aot --prod` in the frontend folder and then copy the files from `frontend/dist/ESE-Angular-Frontend` to your webserver.

If you run an apache server you probably have to change your `.htaccess` the following way to enable Angular Routing correctly:
```
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} -s [OR]
RewriteCond %{REQUEST_FILENAME} -l [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^.*$ - [NC,L]
RewriteRule ^(.*) /index.html [NC,L]
```
