import React from 'react';
import { Mail, Check, X } from 'lucide-react';

interface Invitation {
    id: string;
    spaceId: string;
    spaceName: string;
    inviterEmail: string;
}

interface InvitationCardProps {
    invitation: Invitation;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
    invitation,
    onAccept,
    onReject
}) => {
    return (
        <div className="retro-card bg-blue-50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 border-2 border-black">
                    <Mail size={20} className="text-white" />
                </div>
                <div>
                    <p className="font-bold">{invitation.spaceName}</p>
                    <p className="text-sm text-gray-600">
                        from {invitation.inviterEmail}
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onAccept(invitation.id)}
                    className="px-4 py-2 bg-green-500 text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                >
                    <Check size={16} />
                    Accept
                </button>
                <button
                    onClick={() => onReject(invitation.id)}
                    className="px-4 py-2 bg-red-500 text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                >
                    <X size={16} />
                    Reject
                </button>
            </div>
        </div>
    );
};
