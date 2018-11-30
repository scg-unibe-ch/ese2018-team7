import {Router} from 'express';

// Set Router
const router: Router = Router();

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    info: {
      title: 'ESE 2018 Team 7 API',
      description: 'This is the API documentation to the backend of the Job Portal by ESE 2018 Team 7',
      version: '1.0.0',
    },
  },
  host: 'localhost:3000',
  basePath: '/',
  tags: [
    {name: 'job', description: 'Everything about the Jobs'},
    {name: 'user', description: 'Everything about the User'},
    {name: 'company', description: 'Everything about the Company'},
    {name: 'miscellaneous', description: 'Miscellaneous'},
  ],

  apis: ['./app/**/*.ts'], // Where to search for definitions
};
const swaggerSpec = swaggerJSDoc(options);

router.use('/', swaggerUi.serve);


/**
 * @swagger
 *
 * /docs:
 *   get:
 *     tags:
 *     - miscellaneous
 *     summary: Get this API Documentation
 *     description: Get this API Documentation
 *     operationId: swaggerDocs
 *     produces:
 *       - text/html
 *     responses:
 *       200:
 *         description: this page
 */
router.get('/', swaggerUi.setup(swaggerSpec));

// Export this Controller
export const Swagger: Router = router;
