import express from 'express';
import AppController from '../controllers/app.controller.js';

const router = express.Router();

router.get('/', AppController.getListening);

export default router;