import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    bgColor: string;
    iconColor: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    icon: Icon,
    title,
    description,
    bgColor,
    iconColor
}) => {
    return (
        <div className={`retro-card ${bgColor} p-8`}>
            <div className={`${iconColor} w-20 h-20 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8`}>
                <Icon size={40} className="text-white" />
            </div>
            <h3 className="text-3xl font-black uppercase mb-4">
                {title}
            </h3>
            <p className="text-lg font-medium leading-relaxed text-gray-800">
                {description}
            </p>
        </div>
    );
};
