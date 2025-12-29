import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { MovieCard } from '../components/MovieCard';

import { getSpaces, createSpace, addMovieToSpace, removeMovieFromSpace, getPersonalMovies, addMovieToPersonal, removeMovieFromPersonal, logout, addMemberToSpace, getPendingInvitations, acceptInvitation, rejectInvitation, Invitation } from '../services/api.service';
import { Space, Movie } from '../types';
import { searchMovies } from '../services/tmdb.service';

interface DashboardPageProps {
    user: any;
    onLogout: () => void;
    onMovieSelect: (movie: Movie) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, onMovieSelect }) => {
    console.log('DashboardPage rendered');
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [personalMovies, setPersonalMovies] = useState<Movie[]>([]);
    const [activeTab, setActiveTab] = useState<'spaces' | 'personal'>('personal');
    const [newSpaceName, setNewSpaceName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
    const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
    const [inviteEmail, setInviteEmail] = useState('');
    const [showInviteForm, setShowInviteForm] = useState(false);

    useEffect(() => {
        loadData();
    }, [user.id]);

    const loadData = async () => {
        try {
            const [spacesData, personalData, invitationsData] = await Promise.all([
                getSpaces(user.id),
                getPersonalMovies(user.id),
                getPendingInvitations()
            ]);
            setSpaces(spacesData);
            setPersonalMovies(personalData);
            setInvitations(invitationsData);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const handleCreateSpace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSpaceName.trim()) return;
        try {
            const newSpace = await createSpace(user.id, newSpaceName);
            setSpaces([...spaces, newSpace]);
            setNewSpaceName('');
        } catch (error) {
            console.error('Failed to create space:', error);
        }
    };

    const handleAcceptInvitation = async (invitationId: string) => {
        try {
            await acceptInvitation(invitationId);
            // Refresh data to show new space and remove invitation
            loadData();
        } catch (error) {
            console.error('Failed to accept invitation:', error);
        }
    };

    const handleRejectInvitation = async (invitationId: string) => {
        try {
            await rejectInvitation(invitationId);
            setInvitations(invitations.filter(inv => inv.id !== invitationId));
        } catch (error) {
            console.error('Failed to reject invitation:', error);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim() || !selectedSpaceId) return;
        try {
            await addMemberToSpace(selectedSpaceId, inviteEmail);
            setInviteEmail('');
            setShowInviteForm(false);
            alert('Invitation sent!');
        } catch (error) {
            console.error('Failed to invite member:', error);
            alert('Failed to send invitation.');
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        try {
            const results = await searchMovies(searchQuery);
            setSearchResults(results);
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleAddMovie = async (movie: Movie) => {
        try {
            if (activeTab === 'spaces' && selectedSpaceId) {
                await addMovieToSpace(selectedSpaceId, movie);
                const updatedSpaces = await getSpaces(user.id);
                setSpaces(updatedSpaces);
            } else {
                await addMovieToPersonal(user.id, movie);
                setPersonalMovies([...personalMovies, movie]);
            }
            setSearchResults([]);
            setSearchQuery('');
        } catch (error) {
            console.error('Failed to add movie:', error);
        }
    };

    const handleRemoveMovie = async (movieId: string, spaceId?: string) => {
        try {
            if (spaceId) {
                await removeMovieFromSpace(spaceId, movieId);
                const updatedSpaces = await getSpaces(user.id);
                setSpaces(updatedSpaces);
            } else {
                await removeMovieFromPersonal(user.id, movieId);
                setPersonalMovies(personalMovies.filter(m => m.id !== movieId));
            }
        } catch (error) {
            console.error('Failed to remove movie:', error);
        }
    };

    const handleSpaceClick = (spaceId: string) => {
        setSelectedSpaceId(spaceId);
        setViewMode('detail');
        setShowInviteForm(false);
    };

    const handleBackToSpaces = () => {
        setViewMode('list');
        setSelectedSpaceId(null);
    };

    // Derived state for the current view
    const currentSpace = spaces.find(s => s.id === selectedSpaceId);

    return (
        <div className="min-h-screen pb-12 pt-8 mt-24">

            <div className="container">
                {/* Tabs */}
                <div className="flex mt-12 justify-center gap-8 mb-10 border-b-2 border-gray-300 pb-1">
                    <button
                        className={`text-xl md:text-2xl uppercase font-bold px-6 py-2 transition-all ${activeTab === 'spaces' ? 'text-red-600 border-b-4 border-red-600 -mb-2' : 'text-gray-400 hover:text-black'}`}
                        onClick={() => { setActiveTab('spaces'); setViewMode('list'); }}
                    >
                        Spaces
                    </button>
                    <button
                        className={`text-xl md:text-2xl uppercase font-bold px-6 py-2 transition-all ${activeTab === 'personal' ? 'text-red-600 border-b-4 border-red-600 -mb-2' : 'text-gray-400 hover:text-black'}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        My Watchlist
                    </button>
                </div>

                {/* Spaces Tab */}
                {activeTab === 'spaces' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {viewMode === 'list' ? (
                            /* Spaces List View */
                            <div>
                                {/* Pending Invitations Section */}
                                {invitations.length > 0 && (
                                    <div className="mb-12">
                                        <h2 className="text-2xl font-bold uppercase mb-4 text-red-600">Pending Invitations</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {invitations.map(invitation => (
                                                <div key={invitation.id} className="bg-yellow-100 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-bold text-lg">{invitation.space.name}</h3>
                                                        <p className="text-sm text-gray-700">Invited by <span className="font-bold">{invitation.invitedBy.username}</span></p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button onClick={() => handleAcceptInvitation(invitation.id)} size="sm" className="bg-green-500 text-white border-black hover:bg-green-600">Accept</Button>
                                                        <Button onClick={() => handleRejectInvitation(invitation.id)} size="sm" variant="secondary" className="bg-red-500 text-white border-black hover:bg-red-600">Reject</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                                    <h2 className="text-3xl font-bold uppercase">Your Spaces</h2>
                                    <form onSubmit={handleCreateSpace} className="flex gap-2 w-full md:w-auto">
                                        <input
                                            type="text"
                                            value={newSpaceName}
                                            onChange={(e) => setNewSpaceName(e.target.value)}
                                            placeholder="New Space Name"
                                            className="retro-input mb-0 w-full md:w-64"
                                        />
                                        <Button type="submit">Create</Button>
                                    </form>
                                </div>

                                {spaces.length === 0 ? (
                                    <div className="bg-white p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                                        <p className="text-xl text-gray-500 italic">No spaces yet. Create your first space to start collaborating!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {spaces.map(space => (
                                            <div
                                                key={space.id}
                                                className="retro-card cursor-pointer hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group bg-white"
                                                onClick={() => handleSpaceClick(space.id)}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="text-2xl font-bold group-hover:text-red-600 transition-colors">{space.name}</h3>
                                                    <span className="bg-black text-white text-xs px-2 py-1 font-bold">{space.movies?.length || 0} Movies</span>
                                                </div>
                                                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                                                    {space.memberIds?.length || 1} Members
                                                </p>
                                                <div className="mt-6 flex justify-end">
                                                    <span className="text-sm font-bold underline decoration-2 decoration-red-600 underline-offset-4 group-hover:text-red-600">Enter Space &rarr;</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Space Detail View */
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                    <div className="flex items-center gap-4">
                                        <Button variant="secondary" onClick={handleBackToSpaces} size="sm">&larr; Back</Button>
                                        <h2 className="text-3xl md:text-4xl font-bold uppercase border-l-4 border-red-600 pl-4">
                                            {currentSpace?.name}
                                        </h2>
                                    </div>

                                    <div className="relative">
                                        {!showInviteForm ? (
                                            <Button onClick={() => setShowInviteForm(true)} size="sm" className="bg-blue-500 text-white border-black">
                                                + Invite Member
                                            </Button>
                                        ) : (
                                            <form onSubmit={handleInvite} className="flex gap-2 animate-in fade-in slide-in-from-right-4">
                                                <input
                                                    type="email"
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                    placeholder="Friend's Email"
                                                    className="retro-input mb-0 py-1 px-2 text-sm w-48"
                                                    autoFocus
                                                />
                                                <Button type="submit" size="sm">Send</Button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowInviteForm(false)}
                                                    className="text-red-600 font-bold px-2"
                                                >
                                                    ✕
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>

                                {/* Search within Space */}
                                <div className="mb-10 bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    <h3 className="text-xl mb-4 uppercase font-bold flex items-center gap-2">
                                        <span className="text-red-600">+</span> Add Movie to Space
                                    </h3>
                                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search TMDB..."
                                            className="retro-input mb-0 flex-grow"
                                        />
                                        <Button type="submit" className="w-full sm:w-auto">Search</Button>
                                    </form>

                                    {searchResults.length > 0 && (
                                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {searchResults.map(movie => (
                                                <div key={movie.id} className="h-auto">
                                                    <MovieCard
                                                        movie={movie}
                                                        actionType="add"
                                                        onAction={(e) => { e.stopPropagation(); handleAddMovie(movie); }}
                                                        onClick={() => onMovieSelect(movie)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Movies Grid */}
                                {(!currentSpace?.movies || currentSpace.movies.length === 0) ? (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-400 rounded-lg">
                                        <p className="text-xl text-gray-500 italic">This space is empty.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {currentSpace.movies.map(movie => (
                                            <div key={movie.id} className="h-auto">
                                                <MovieCard
                                                    movie={movie}
                                                    actionType="remove"
                                                    onAction={(e) => { e.stopPropagation(); handleRemoveMovie(movie.id, currentSpace.id); }}
                                                    onClick={() => onMovieSelect(movie)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Personal Collection Tab */}
                {activeTab === 'personal' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Search Personal */}
                        <div className="mb-10 bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xl mb-4 uppercase font-bold flex items-center gap-2">
                                <span className="text-red-600">+</span> Add to Watchlist
                            </h3>
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search TMDB..."
                                    className="retro-input mb-0 flex-grow"
                                />
                                <Button type="submit" className="w-full sm:w-auto">Search</Button>
                            </form>

                            {searchResults.length > 0 && (
                                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {searchResults.map(movie => (
                                        <div key={movie.id} className="h-auto">
                                            <MovieCard
                                                movie={movie}
                                                actionType="add"
                                                onAction={(e) => { e.stopPropagation(); handleAddMovie(movie); }}
                                                onClick={() => onMovieSelect(movie)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {personalMovies.length === 0 ? (
                            <div className="bg-white p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                                <p className="text-xl text-gray-500 italic">
                                    Your watchlist is empty. Search for movies above to add them!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {personalMovies.map(movie => (
                                    <div key={movie.id} className="h-auto">
                                        <MovieCard
                                            movie={movie}
                                            actionType="remove"
                                            onAction={(e) => { e.stopPropagation(); handleRemoveMovie(movie.id); }}
                                            onClick={() => onMovieSelect(movie)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Movie Detail Modal - Rendered outside container to avoid clipping */}

        </div>
    );
};
