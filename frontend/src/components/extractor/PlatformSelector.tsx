import React from 'react';
import { Youtube } from 'lucide-react';

interface PlatformSelectorProps {
    platform: 'youtube' | null;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ platform }) => {
    if (!platform) return null;

    return (
        <div className="flex items-center gap-2 mb-4">
            <div className="bg-red-500 p-2 border-2 border-black">
                <Youtube size={20} className="text-white" />
            </div>
            <span className="font-bold">YouTube Shorts</span>
        </div>
    );
};
