import {User} from '../models/user.model';
import {Response} from 'express';
import {Request} from '../interfaces/request.interface';
import {asyncRoute} from '../helper/async.helper';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const query = req.params.searchString + ' logo';
  const https = require('https');
  const subscriptionKey = 'here goes the api key'; // TODO: fetch api key
  const host = 'api.cognitive.microsoft.com';
  const path = '/bing/v7.0/images/search';

  const request_params = {
    method : 'GET',
    hostname : host,
    path : path + '?q=' + encodeURIComponent(query),
    headers : {
      'Ocp-Apim-Subscription-Key' : subscriptionKey,
    }
  };

  const response_handler = function (response: any) {
    let body = '';

    response.on('data', function (d: any) {
      body += d;
    });

    response.on('end', function () {
      const imageResults = JSON.parse(body);
      const imageNumber = Math.floor(Math.random() * 10);
      const firstImageResult = imageResults.value[imageNumber];
      console.log(`Image result count: ${imageResults.value.length}`);
      console.log(`First image thumbnail url: ${firstImageResult.thumbnailUrl}`);
      console.log(`First image url: ${firstImageResult.contentUrl}`);
    });
  };

  const msReq = https.request(request_params, response_handler);
  msReq.end();

  res.status(200).send('test'); // TODO: return blob of image

});
