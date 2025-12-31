import React from 'react';
import { Users, Trash2 } from 'lucide-react';
import { Space } from '../../types';

interface SpaceCardProps {
    space: Space;
    onSelect: (spaceId: string) => void;
    onDelete?: (spaceId: string) => void;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({ space, onSelect, onDelete }) => {
    return (
        <div
            onClick={() => onSelect(space.id)}
            className="retro-card bg-white p-6 cursor-pointer hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 p-3 border-2 border-black">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase">{space.name}</h3>
                        <p className="text-sm text-gray-600">
                            {space.memberIds?.length || 0} members
                        </p>
                    </div>
                </div>
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(space.id);
                        }}
                        className="p-2 hover:bg-red-100 border-2 border-black"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
            <div className="text-sm text-gray-700">
                {space.movies?.length || 0} movies
            </div>
        </div>
    );
};
