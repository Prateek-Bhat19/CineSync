import React, { useState } from 'react';
import { Button } from '../components/Button';
import { login } from '../services/api.service';

interface LoginPageProps {
    onLoginSuccess: () => void;
    onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-4">
            <div className="retro-card w-full max-w-md">
                <h2 className="text-4xl mb-6 text-center">Login</h2>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-4 font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                        {loading ? 'Loading...' : 'Enter Cinema'}
                    </Button>
                </form>

                <p className="mt-6 text-center">
                    New here?{' '}
                    <button
                        onClick={() => onNavigate('register')}
                        className="text-blue-700 font-bold hover:underline uppercase"
                    >
                        Get a Ticket
                    </button>
                </p>
            </div>
        </div>
    );
};
