import { Router } from 'express';
import * as spaceController from '../controllers/space.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All space routes require authentication
router.use(authenticate);

router.get('/', spaceController.getSpaces);
router.post('/', spaceController.createSpace);
router.post('/:spaceId/members', spaceController.addMember);
router.post('/:spaceId/movies', spaceController.addMovie);
router.delete('/:spaceId/movies/:movieId', spaceController.removeMovie);

export default router;
