import mongoose, { Schema, Document } from 'mongoose';

export interface IInvitation extends Document {
  spaceId: mongoose.Types.ObjectId;
  invitedEmail: string;
  invitedBy: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const invitationSchema = new Schema<IInvitation>({
  spaceId: {
    type: Schema.Types.ObjectId,
    ref: 'Space',
    required: true
  },
  invitedEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
invitationSchema.index({ invitedEmail: 1, status: 1 });
invitationSchema.index({ spaceId: 1 });

// Prevent duplicate pending invitations
invitationSchema.index({ spaceId: 1, invitedEmail: 1, status: 1 }, { unique: true });

export const Invitation = mongoose.model<IInvitation>('Invitation', invitationSchema);
