import {Response} from 'express';
import {Request} from '../interfaces/request.interface';
import {asyncRoute} from '../helper/async.helper';

module.exports = asyncRoute(async (req: Request, res: Response) => {

  const query = req.params.searchString + ' logo';
  const https = require('https');
  const http = require('http');
  const fetch = require('node-fetch');
  const fs = require('fs');
  const subscriptionKey = JSON.parse(fs.readFileSync('./app/msApiKey.json')).key;
  const host = 'api.cognitive.microsoft.com';
  const path = '/bing/v7.0/images/search';

  const request_params = {
    method : 'GET',
    hostname : host,
    path : path + '?q=' + encodeURIComponent(query) + '&count=10&safeSeach=Strict',
    headers : {
      'Ocp-Apim-Subscription-Key' : subscriptionKey,
    },
  };

  const getBase64Images = async (url: string, datatype: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return '';
      }

      const dataurl = 'data:image/' + datatype + ';base64,';
      console.log(url);
      return dataurl + new Buffer(await response.buffer()).toString('base64');
    } catch (e) {
      console.log('Failed: ' + url);
      return '';
    }
  };

  const response_handler = async function (response: any) {
    let body = '';

    response.on('data', function (d: any) {
      body += d;
    });

    response.on('end', async function () {

      const images = [];
      const imageResults = JSON.parse(body);

      for (let i = 0; i < imageResults.value.length; ++i) {
        const img = await getBase64Images(imageResults.value[i].contentUrl, imageResults.value[i].encodingFormat);
        if (img !== '') {
          images.push(img);
        }
      }

      const imageNumber = Math.floor(Math.random() * 10);
      console.log(`Image result count: ${imageResults.value.length}`);
      res.status(200).send(JSON.stringify(images));
    });
  };

  const msReq = https.request(request_params, response_handler);
  msReq.end();

});
