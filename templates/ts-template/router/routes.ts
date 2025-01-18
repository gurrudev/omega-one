import express, {Router} from 'express';
const router: Router = express.Router();

import Controller from '../controller/app.controller'

router.get('/', Controller.getListening);
router.get('/a', Controller.getHelloWorld);

export default router;