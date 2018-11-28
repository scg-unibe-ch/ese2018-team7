import {Router} from 'express';

// Set Router
const router: Router = Router();

const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = JSON.parse(fs.readFileSync('./app/swagger.json'));

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

// Export this Controller
export const Swagger: Router = router;
