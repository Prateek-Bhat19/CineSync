import React, { useState } from 'react';
import { Button } from '../components/Button';
import { register } from '../services/api.service';

interface RegisterPageProps {
    onLoginSuccess: () => void;
    onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onLoginSuccess, onNavigate }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(username, email, password);
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-4">
            <div className="retro-card w-full max-w-md">
                <h2 className="text-4xl mb-6 text-center">Register</h2>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-4 font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block font-bold mb-1 uppercase">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="retro-input"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-1 uppercase">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="retro-input"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-1 uppercase">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="retro-input"
                            required
                        />
                    </div>

                    <Button type="submit" disabled={loading} fullWidth className="mt-2">
                        {loading ? 'Printing Ticket...' : 'Get Ticket'}
                    </Button>
                </form>

                <p className="mt-6 text-center">
                    Already have a ticket?{' '}
                    <button
                        onClick={() => onNavigate('login')}
                        className="text-blue-700 font-bold hover:underline uppercase"
                    >
                        Enter Here
                    </button>
                </p>
            </div>
        </div>
    );
};
