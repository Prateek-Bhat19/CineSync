import React from 'react';

interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
    tabs,
    activeTab,
    onTabChange
}) => {
    return (
        <div className="flex gap-4 mb-8 border-b-4 border-black">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-6 py-3 font-bold text-lg border-2 border-black transition-all ${activeTab === tab.id
                            ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-4px]'
                            : 'bg-white hover:bg-gray-100'
                        }`}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className="ml-2 px-2 py-1 bg-black text-white text-sm rounded">
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};
