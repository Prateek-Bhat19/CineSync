import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  analyzeVideo,
  addMoviesToList,
  getExtractionHistory,
  deleteExtraction
} from '../controllers/video-extraction.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Analyze video and extract movies
router.post('/analyze', analyzeVideo);

// Add extracted movies to watchlist or space
router.post('/:id/add-to-list', addMoviesToList);

// Get extraction history
router.get('/history', getExtractionHistory);

// Delete extraction
router.delete('/:id', deleteExtraction);

export default router;
