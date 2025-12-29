import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { getSession, logout } from './services/api.service';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState<any>(() => {
    const saved = localStorage.getItem('cinesync_selected_movie');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (selectedMovie) {
      localStorage.setItem('cinesync_selected_movie', JSON.stringify(selectedMovie));
    } else {
      localStorage.removeItem('cinesync_selected_movie');
    }
  }, [selectedMovie]);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await getSession();
      if (session) {
        setUser(session.user);
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Session check failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    await checkSession();
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setCurrentPage('landing');
    setSelectedMovie(null);
  };

  const handleMovieSelect = (movie: any) => {
    console.log('Movie selected:', movie);
    setSelectedMovie(movie);
    setCurrentPage('movie-detail');
  };

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl font-bold animate-pulse">Loading Reel...</div>
        </div>
      );
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterPage onLoginSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />;
      case 'dashboard':
        return user ? (
          <DashboardPage
            user={user}
            onLogout={handleLogout}
            onMovieSelect={handleMovieSelect}
          />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />
        );
      case 'profile':
        return user ? <ProfilePage user={user} onNavigate={setCurrentPage} /> : <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />;
      case 'movie-detail':
        if (!user) return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />;
        if (!selectedMovie) {
          return (
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h2 className="text-2xl font-bold mb-4">No movie selected</h2>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="btn-primary"
              >
                Back to Dashboard
              </button>
            </div>
          );
        }
        return (
          <MovieDetailPage
            movie={selectedMovie}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <header className="bg-white text-black p-4 border-b-4 border-black sticky top-0 z-50 shadow-retro">
        <div className="container flex justify-between items-center">
          <div
            className="text-3xl font-bold tracking-widest cursor-pointer"
            style={{ fontFamily: 'var(--font-heading)' }}
            onClick={() => setCurrentPage(user ? 'dashboard' : 'landing')}
          >
            CineSync
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage('profile')}
                className="btn-oval"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="retro-btn"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {renderPage()}
      </main>

      <footer className="bg-black text-white p-8 text-center border-t-4 border-red-600 mt-auto">
        <p className="font-bold uppercase tracking-wider">© 2025 CineSync. Retro Movie Magic.</p>
      </footer>
    </div>
  );
};

export default App;