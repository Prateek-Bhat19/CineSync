import React from 'react';
import { Button } from '../components/Button';

interface ProfilePageProps {
    user: any;
    onNavigate: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onNavigate }) => {
    return (
        <div className="container min-h-screen py-12">
            <div className="retro-card max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
                    <Button variant="secondary" onClick={() => onNavigate('dashboard')} >&larr; Back</Button>
                    <h2 className="text-3xl font-bold uppercase">User Profile</h2>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold uppercase text-gray-500">Username</label>
                        <div className="text-2xl font-bold p-4 bg-gray-100 border-2 border-black">
                            {user.username}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold uppercase text-gray-500">Email</label>
                        <div className="text-2xl font-bold p-4 bg-gray-100 border-2 border-black">
                            {user.email}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold uppercase text-gray-500">Member Since</label>
                        <div className="text-xl font-bold p-4 bg-gray-100 border-2 border-black">
                            {new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
