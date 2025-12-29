import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  sendInvitation,
  getPendingInvitations,
  acceptInvitation,
  rejectInvitation
} from '../controllers/invitation.controller.js';

const router = express.Router();

// All invitation routes require authentication
router.use(authenticate);

// Send invitation to join a space
router.post('/', sendInvitation);

// Get pending invitations for current user
router.get('/pending', getPendingInvitations);

// Accept invitation
router.post('/:id/accept', acceptInvitation);

// Reject invitation
router.post('/:id/reject', rejectInvitation);

export default router;
