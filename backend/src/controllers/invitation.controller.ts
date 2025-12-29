import { Request, Response } from 'express';
import { Invitation, User, Space } from '../models/index.js';

// Send invitation to join a space
export const sendInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { spaceId, email } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Validation
    if (!spaceId || !email) {
      res.status(400).json({ error: 'Space ID and email are required' });
      return;
    }

    // Check if space exists and user is the owner or a member
    const space = await Space.findById(spaceId);
    if (!space) {
      res.status(404).json({ error: 'Space not found' });
      return;
    }

    if (space.ownerId.toString() !== userId && !space.memberIds.some(id => id.toString() === userId)) {
      res.status(403).json({ error: 'You do not have permission to invite members to this space' });
      return;
    }

    // Check if user exists with this email
    const invitedUser = await User.findOne({ email: email.toLowerCase() });
    if (!invitedUser) {
      res.status(404).json({ error: 'No user found with this email address' });
      return;
    }

    // Check if user is already a member
    if (space.ownerId.toString() === invitedUser._id.toString() || 
        space.memberIds.some(id => id.toString() === invitedUser._id.toString())) {
      res.status(400).json({ error: 'User is already a member of this space' });
      return;
    }

    // Check for existing pending invitation
    const existingInvitation = await Invitation.findOne({
      spaceId,
      invitedEmail: email.toLowerCase(),
      status: 'pending'
    });

    if (existingInvitation) {
      res.status(400).json({ error: 'An invitation has already been sent to this user' });
      return;
    }

    // Create invitation
    const invitation = await Invitation.create({
      spaceId,
      invitedEmail: email.toLowerCase(),
      invitedBy: userId,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Invitation sent successfully',
      invitation: {
        id: invitation._id.toString(),
        spaceId: invitation.spaceId.toString(),
        invitedEmail: invitation.invitedEmail,
        status: invitation.status,
        createdAt: invitation.createdAt
      }
    });
  } catch (error: any) {
    console.error('Send invitation error:', error);
    res.status(500).json({ error: error.message || 'Failed to send invitation' });
  }
};

// Get pending invitations for the current user
export const getPendingInvitations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Get user's email
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Find pending invitations for this user's email
    const invitations = await Invitation.find({
      invitedEmail: user.email,
      status: 'pending'
    })
      .populate('spaceId', 'name description')
      .populate('invitedBy', 'username email')
      .sort({ createdAt: -1 });

    const formattedInvitations = invitations.map(inv => ({
      id: inv._id.toString(),
      space: {
        id: (inv.spaceId as any)._id.toString(),
        name: (inv.spaceId as any).name,
        description: (inv.spaceId as any).description
      },
      invitedBy: {
        username: (inv.invitedBy as any).username,
        email: (inv.invitedBy as any).email
      },
      createdAt: inv.createdAt
    }));

    res.json(formattedInvitations);
  } catch (error: any) {
    console.error('Get pending invitations error:', error);
    res.status(500).json({ error: error.message || 'Failed to get invitations' });
  }
};

// Accept invitation
export const acceptInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Find invitation
    const invitation = await Invitation.findById(id);
    if (!invitation) {
      res.status(404).json({ error: 'Invitation not found' });
      return;
    }

    // Verify invitation is for this user
    if (invitation.invitedEmail !== user.email) {
      res.status(403).json({ error: 'This invitation is not for you' });
      return;
    }

    // Check if already accepted or rejected
    if (invitation.status !== 'pending') {
      res.status(400).json({ error: `Invitation has already been ${invitation.status}` });
      return;
    }

    // Add user to space
    const space = await Space.findById(invitation.spaceId);
    if (!space) {
      res.status(404).json({ error: 'Space not found' });
      return;
    }

    // Check if user is not already a member
    if (!space.memberIds.some(id => id.toString() === userId)) {
      space.memberIds.push(user._id);
      await space.save();
    }

    // Update invitation status
    invitation.status = 'accepted';
    await invitation.save();

    res.json({
      message: 'Invitation accepted successfully',
      space: {
        id: space._id.toString(),
        name: space.name,
        description: space.description
      }
    });
  } catch (error: any) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ error: error.message || 'Failed to accept invitation' });
  }
};

// Reject invitation
export const rejectInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Find invitation
    const invitation = await Invitation.findById(id);
    if (!invitation) {
      res.status(404).json({ error: 'Invitation not found' });
      return;
    }

    // Verify invitation is for this user
    if (invitation.invitedEmail !== user.email) {
      res.status(403).json({ error: 'This invitation is not for you' });
      return;
    }

    // Check if already accepted or rejected
    if (invitation.status !== 'pending') {
      res.status(400).json({ error: `Invitation has already been ${invitation.status}` });
      return;
    }

    // Update invitation status
    invitation.status = 'rejected';
    await invitation.save();

    res.json({ message: 'Invitation rejected successfully' });
  } catch (error: any) {
    console.error('Reject invitation error:', error);
    res.status(500).json({ error: error.message || 'Failed to reject invitation' });
  }
};
