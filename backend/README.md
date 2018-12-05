## Backend

This is the backend of our application, which is built with Express.
For more information refer to the main [README](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/README.md)
or the [project wiki](https://github.com/scg-unibe-ch/ese2018-team7/wiki).

### How to run
After you run the [start.sh](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/start.sh) script,
the backend should open running and is accessible at [localhost:3000](http://localhost:3000).
However, in general no output will be shown if you visit this page in your browser.

If you start the backend with no database available, a new empty database will be created with a single administrator:
 * Username: `admin`
 * Password: `admin`

**Important**: In order for the surprise feature (company logo web search) to work correctly, you need a valid [Bing Cognitive Services API key by Microsoft Azure](https://azure.microsoft.com/en-us/services/cognitive-services/bing-image-search-api/), that has to be pasted into the [msApiKey.json](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/backend/app/msApiKey.json) file. Otherwise this functionality will not work!

### Documentation
In order to view the documentation, you can navigate to [localhost:3000/docs](http://localhost:3000/docs),
where detailed API documentation of our backend is shown by swagger UI.

### Deployment
Don't forget to add your valid [Bing Cognitive Services API key by Microsoft Azure](https://azure.microsoft.com/en-us/services/cognitive-services/bing-image-search-api/), into the [msApiKey.json](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/backend/app/msApiKey.json) file.

If you want the backend on a different Port than 3000, change in [server.ts](https://github.com/scg-unibe-ch/ese2018-team7/blob/master/backend/app/server.ts) the port number in line 49 (`let port = 3000;`).

Then run `npm run tsc` once and `node build/server.js` to start your backend NodeJs-Server.
