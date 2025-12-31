import { useState } from 'react';
import { Loader2, Film, CheckCircle2, AlertCircle, Youtube } from 'lucide-react';
import { videoExtractionService, VideoExtraction } from '../services/video-extraction.service';
import { MovieCard } from './MovieCard';
import { Movie } from '../types';

interface VideoExtractorProps {
    spaces?: Array<{ id: string; name: string }>;
    onSuccess?: () => void;
}

export default function VideoExtractor({ spaces = [], onSuccess }: VideoExtractorProps) {
    const [videoUrl, setVideoUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [extraction, setExtraction] = useState<VideoExtraction | null>(null);
    const [selectedMovies, setSelectedMovies] = useState<Set<number>>(new Set());
    const [destination, setDestination] = useState<{ type: 'personal' | 'space'; listId?: string }>({
        type: 'personal'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleAnalyze = async () => {
        console.log('🎬 Starting video analysis...');
        setError('');
        setSuccess('');

        // Validate URL
        const validation = videoExtractionService.isValidVideoUrl(videoUrl);
        console.log('🔍 URL validation:', validation);

        if (!validation.valid) {
            console.error('❌ Invalid URL');
            setError('Please enter a valid YouTube Shorts URL');
            return;
        }

        setIsAnalyzing(true);
        try {
            console.log('📡 Calling API with URL:', videoUrl);
            const result = await videoExtractionService.analyzeVideo(videoUrl);
            console.log('✅ API response received:', result);

            if (result.extraction) {
                console.log('🎯 Extraction data:', result.extraction);
                console.log('🎬 Movies found:', result.extraction.extractedMovies);
                setExtraction(result.extraction);
                // Movies are unchecked by default as per requirement
                setSelectedMovies(new Set());
            } else {
                console.warn('⚠️ No extraction in response');
                setError(result.message || 'No movies found in this video');
            }
        } catch (err: any) {
            console.error('❌ Error during analysis:', err);
            console.error('Error response:', err.response);
            setError(err.response?.data?.message || 'Failed to analyze video');
        } finally {
            setIsAnalyzing(false);
            console.log('✨ Analysis complete');
        }
    };

    const handleToggleMovie = (tmdbId: number) => {
        const newSelected = new Set(selectedMovies);
        if (newSelected.has(tmdbId)) {
            newSelected.delete(tmdbId);
        } else {
            newSelected.add(tmdbId);
        }
        setSelectedMovies(newSelected);
    };

    const handleAddToList = async () => {
        if (selectedMovies.size === 0) {
            setError('Please select at least one movie');
            return;
        }

        if (destination.type === 'space' && !destination.listId) {
            setError('Please select a space');
            return;
        }

        setIsAdding(true);
        setError('');

        try {
            const result = await videoExtractionService.addMoviesToList(extraction!.id, {
                movieIds: Array.from(selectedMovies),
                destination
            });

            setSuccess(result.message);
            setTimeout(() => {
                onSuccess?.();
                handleReset();
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add movies');
        } finally {
            setIsAdding(false);
        }
    };

    const handleReset = () => {
        setVideoUrl('');
        setExtraction(null);
        setSelectedMovies(new Set());
        setError('');
        setSuccess('');
        setDestination({ type: 'personal' });
    };

    const getPlatformIcon = () => {
        const validation = videoExtractionService.isValidVideoUrl(videoUrl);
        if (validation.platform === 'youtube') {
            return <Youtube className="w-5 h-5 text-red-600" />;
        }
        return <Film className="w-5 h-5 text-gray-500" />;
    };

    // Helper to convert ExtractedMovie to Movie type for MovieCard
    const convertToMovie = (extracted: any): Movie => ({
        id: extracted.tmdbId?.toString() || '0',
        tmdbId: extracted.tmdbId || 0,
        title: extracted.title,
        overview: extracted.overview || '',
        plot: extracted.overview || '',
        genre: [],
        posterUrl: extracted.posterPath ? `https://image.tmdb.org/t/p/w500${extracted.posterPath}` : undefined,
        year: extracted.year?.toString(),
        rating: '0/10' // Default as not provided in extraction
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 w-full mb-12">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
                    <div className="bg-red-500 p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Film className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-wider text-gray-900 leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                            Extract from Video
                        </h2>
                        <p className="text-gray-700 font-bold mt-1">Paste a URL to automatically find movies mentioned in the video.</p>
                    </div>
                </div>

                <div className="min-h-[400px]">
                    {/* URL Input */}
                    {!extraction && (
                        <div className="max-w-3xl mx-auto py-12 space-y-8">
                            <div>
                                <label className="block text-2xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Video Source URL
                                </label>
                                <div className="relative group">
                                    <input
                                        type="url"
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder="Paste YouTube Shorts URL..."
                                        className="retro-input pl-14 text-xl py-4 border-4 focus:shadow-[8px_8px_0px_0px_#d62828] transition-all bg-white"
                                        disabled={isAnalyzing}
                                    />
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-gray-100 p-1 rounded border-2 border-black">
                                        {getPlatformIcon()}
                                    </div>
                                </div>
                                <p className="text-base text-gray-600 mt-3 font-bold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    Supports YouTube Shorts
                                </p>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={!videoUrl || isAnalyzing}
                                className="retro-btn w-full md:w-auto md:min-w-[300px] flex items-center justify-center gap-3 text-xl py-4 mx-auto"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        ANALYZING VIDEO...
                                    </>
                                ) : (
                                    <>
                                        <Film className="w-6 h-6" />
                                        START EXTRACTION
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Results */}
                    {extraction && (
                        <div className="space-y-8">
                            {/* Video Info */}
                            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Youtube className="w-8 h-8 text-red-600" />
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-xl leading-tight">{extraction.videoTitle || 'Unknown Video'}</h3>
                                        <p className="text-gray-500 font-mono text-sm">{extraction.videoUrl}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="text-gray-500 hover:text-black font-bold uppercase text-sm border-b-2 border-transparent hover:border-black transition-colors"
                                >
                                    Analyze Different Video
                                </button>
                            </div>

                            {/* Movie List */}
                            <div>
                                <h3 className="text-2xl font-bold uppercase mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Found Movies <span className="bg-black text-white px-3 py-1 rounded text-lg">{extraction.extractedMovies.length}</span>
                                </h3>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                                    {extraction.extractedMovies.map((movie) => {
                                        const isSelected = movie.tmdbId && selectedMovies.has(movie.tmdbId);
                                        const movieObj = convertToMovie(movie);

                                        return (
                                            <div
                                                key={movie.tmdbId || movie.title}
                                                className="relative group h-auto"
                                                onClick={() => movie.tmdbId && handleToggleMovie(movie.tmdbId)}
                                            >
                                                {/* Selection Check Overlay */}
                                                <div className={`absolute -top-4 -right-4 z-20 transition-all duration-300 ${isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                                    <div className="bg-[#f77f00] text-white rounded-full p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                        <CheckCircle2 className="w-8 h-8" />
                                                    </div>
                                                </div>

                                                {/* Card Container with Selection Border */}
                                                <div className={`
                                                    relative h-full transition-all duration-200
                                                    ${isSelected ? 'transform scale-95 shadow-none' : 'hover:-translate-y-2'}
                                                `}>
                                                    {isSelected && (
                                                        <div className="absolute -inset-2 border-4 border-[#f77f00] z-0 pointer-events-none bg-[#f77f00]/10 scale-105 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
                                                    )}

                                                    <div className="relative z-10 h-full">
                                                        <MovieCard
                                                            movie={movieObj}
                                                            actionType="add"
                                                            onAction={(e) => {
                                                                e.stopPropagation();
                                                                if (movie.tmdbId) handleToggleMovie(movie.tmdbId);
                                                            }}
                                                            onClick={() => {
                                                                if (movie.tmdbId) handleToggleMovie(movie.tmdbId);
                                                            }}
                                                            className={isSelected ? 'shadow-none ring-0' : ''}
                                                        />
                                                    </div>

                                                    {/* Disable interaction overlay if no TMDB ID */}
                                                    {!movie.tmdbId && (
                                                        <div className="absolute inset-0 z-20 bg-gray-200/50 flex items-center justify-center backdrop-blur-[1px] cursor-not-allowed border-2 border-dashed border-gray-400">
                                                            <span className="bg-black text-white px-3 py-1 text-sm font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">Not Found</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-12">
                                <h3 className="text-xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Where to save?</h3>

                                <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end">
                                    <div className="w-full lg:w-auto flex-1 max-w-2xl">
                                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                            <button
                                                onClick={() => setDestination({ type: 'personal' })}
                                                className={`
                                                    flex-1 flex items-center gap-3 p-4 border-4 border-black transition-all duration-200
                                                    ${destination.type === 'personal'
                                                        ? 'bg-blue-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                                                        : 'bg-white hover:bg-gray-50 text-gray-500 hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'
                                                    }
                                                `}
                                            >
                                                <div className={`p-2 rounded-full border-2 border-black ${destination.type === 'personal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-bold uppercase text-lg leading-none">My Watchlist</div>
                                                    <div className="text-xs font-bold opacity-70 mt-1">Personal Collection</div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => setDestination({ type: 'space', listId: spaces[0]?.id })}
                                                className={`
                                                    flex-1 flex items-center gap-3 p-4 border-4 border-black transition-all duration-200
                                                    ${destination.type === 'space'
                                                        ? 'bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                                                        : 'bg-white hover:bg-gray-50 text-gray-500 hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'
                                                    }
                                                `}
                                                disabled={spaces.length === 0}
                                            >
                                                <div className={`p-2 rounded-full border-2 border-black ${destination.type === 'space' ? 'bg-yellow-500 text-black' : 'bg-gray-200'}`}>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-bold uppercase text-lg leading-none">Shared Space</div>
                                                    <div className="text-xs font-bold opacity-70 mt-1">{spaces.length > 0 ? 'Collaborative Lists' : 'No Spaces Created'}</div>
                                                </div>
                                            </button>
                                        </div>

                                        {destination.type === 'space' && spaces.length > 0 && (
                                            <div className="animate-in fade-in slide-in-from-top-2">
                                                <select
                                                    value={destination.listId || ''}
                                                    onChange={(e) => setDestination({ ...destination, listId: e.target.value })}
                                                    className="retro-input w-full md:w-2/3"
                                                >
                                                    {spaces.map((space) => (
                                                        <option key={space.id} value={space.id}>
                                                            Select Space: {space.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleAddToList}
                                        disabled={selectedMovies.size === 0 || isAdding}
                                        className="retro-btn w-full lg:w-auto text-xl px-10 py-5 flex items-center justify-center gap-3 self-stretch lg:self-end"
                                    >
                                        {isAdding ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                SAVING...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-6 h-6" />
                                                SAVE SELECTION ({selectedMovies.size})
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mt-8 p-6 bg-red-100 border-4 border-red-500 shadow-[8px_8px_0px_0px_#ef4444] flex items-center gap-4 animate-in slide-in-from-bottom-2">
                            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-black uppercase text-red-800 text-lg">Error</h4>
                                <p className="font-bold text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="mt-8 p-6 bg-green-100 border-4 border-green-500 shadow-[8px_8px_0px_0px_#22c55e] flex items-center gap-4 animate-in slide-in-from-bottom-2">
                            <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-black uppercase text-green-800 text-lg">Success</h4>
                                <p className="font-bold text-green-700">{success}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
