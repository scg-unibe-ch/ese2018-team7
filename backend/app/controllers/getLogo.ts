import {Response} from 'express';
import {Request} from '../interfaces/request.interface';
import {asyncRoute} from '../helper/async.helper';

/**
 * @swagger
 *
 * /logo/{searchString}:
 *   get:
 *     tags:
 *     - miscellaneous
 *     summary: Search Logo of Company
 *     description: Search Logo of Company on Bing
 *     operationId: getLogo
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: searchString
 *       in: path
 *       description: Companyname to search for on Bing
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: array of images
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             format: base64
 *
 */
module.exports = asyncRoute(async (req: Request, res: Response) => {

  // import stuff
  const https = require('https');
  const fetch = require('node-fetch');
  const fs = require('fs');

  // form search query from companyname
  const query = req.params.searchString + ' logo';

  // Get Subscription key from config file
  const subscriptionKey = JSON.parse(fs.readFileSync('./app/msApiKey.json')).key;

  // define host and path for search
  const host = 'api.cognitive.microsoft.com';
  const path = '/bing/v7.0/images/search';

  const search_request_params = {
    method : 'GET',
    hostname : host,
    path : path + '?q=' + encodeURIComponent(query) + '&count=10&safeSeach=Strict',
    headers : {
      'Ocp-Apim-Subscription-Key' : subscriptionKey,
    },
  };

  // Async function to handle the search response
  const search_response_handler = async function (response: any) {

    let rawAnswer = '';

    // Write Answer to variable
    response.on('data', function (d: any) {
      rawAnswer += d;
    });

    // If finished, then load that images
    response.on('end', async function () {

      // parse JSON-Answer to Object
      const imageResults = JSON.parse(rawAnswer);

      // Build array with promises (and define them) for the image data
      const imagePromises = [];
      for (let i = 0; i < imageResults.value.length; ++i) {
        imagePromises.push(
          fetch(imageResults.value[i].contentUrl).then(
            (fetchRes: any) => {
              if (!fetchRes.ok) {
                return '\x00';
              }
              return fetchRes.buffer();
            }
          ).catch((e: any) => {
            return '\x00';
          })
        );
      }

      // Wait until all images are returned
      const rawData = await Promise.all(imagePromises);
      const images: string[] = [];

      // Parse recieved data as base64 into array
      for (let i = 0; i < rawData.length; ++i) {
        if (rawData[i] !== '\x00') {
          images.push('data:image/' + imageResults.value[i].encodingFormat + ';base64,' + new Buffer(rawData[i]).toString('base64'));
        }
      }

      // Send answer
      res.status(200).send(JSON.stringify(images));
    });
  };

  // Do Request
  https.request(search_request_params, search_response_handler).end();

});
