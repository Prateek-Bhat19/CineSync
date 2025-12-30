import { Router } from 'express';
import * as movieController from '../controllers/movie.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All movie routes require authentication
router.use(authenticate);

router.get('/personal', movieController.getPersonalMovies);
router.post('/personal', movieController.addPersonalMovie);
router.delete('/personal/:movieId', movieController.removePersonalMovie);
router.put('/personal/:movieId', movieController.updatePersonalMovie);

export default router;
