import { useState, useEffect } from 'react';
import { getPendingInvitations, acceptInvitation, rejectInvitation, Invitation } from '../services/api.service';

export const useInvitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInvitations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPendingInvitations();
      setInvitations(data);
    } catch (err) {
      setError('Failed to load invitations');
      console.error('Failed to load invitations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const accept = async (invitationId: string) => {
    try {
      await acceptInvitation(invitationId);
      await loadInvitations(); // Refresh list
      return true;
    } catch (err) {
      setError('Failed to accept invitation');
      console.error('Failed to accept invitation:', err);
      return false;
    }
  };

  const reject = async (invitationId: string) => {
    try {
      await rejectInvitation(invitationId);
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      return true;
    } catch (err) {
      setError('Failed to reject invitation');
      console.error('Failed to reject invitation:', err);
      return false;
    }
  };

  return {
    invitations,
    isLoading,
    error,
    accept,
    reject,
    refresh: loadInvitations
  };
};
