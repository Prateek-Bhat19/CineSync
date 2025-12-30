import React from 'react';
import { Button } from '../components/Button';
import { Users, List, Share2, Clapperboard } from 'lucide-react';

interface LandingPageProps {
    onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section
                style={{
                    minHeight: "calc(100vh - 72px)",
                    backgroundColor: "#f6e8c3",
                    borderBottom: "4px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "64px",
                }}
            >
                <div
                    style={{
                        maxWidth: "1200px",
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: "60% 40%",
                        alignItems: "center",
                        gap: "64px",
                    }}
                >
                    {/* LEFT — IDENTITY */}
                    <div>
                        <div
                            style={{
                                fontSize: "14px",
                                letterSpacing: "0.15em",
                                marginBottom: "24px",
                            }}
                        >
                            EST. 2025
                        </div>

                        <h1
                            style={{
                                fontSize: "11rem",
                                lineHeight: "0.9",
                                margin: "0 0 32px 0",
                                fontWeight: 900,
                                WebkitTextStroke: "1px black",
                            }}
                        >
                            CINE
                            <br />
                            SYNC
                        </h1>

                        <p
                            style={{
                                fontSize: "1.5rem",
                                maxWidth: "520px",
                                marginBottom: "48px",
                                fontWeight: 500,
                            }}
                        >
                            A shared space to decide, watch,
                            <br />
                            and remember movies — together.
                        </p>

                        <div style={{ display: "flex", gap: "24px" }}>
                            <button
                                onClick={() => onNavigate("register")}
                                style={{
                                    padding: "16px 32px",
                                    fontSize: "1.1rem",
                                    fontWeight: 700,
                                    backgroundColor: "#d62828",
                                    color: "white",
                                    border: "3px solid black",
                                    boxShadow: "6px 6px 0 black",
                                    cursor: "pointer",
                                }}
                            >
                                CREATE A SPACE
                            </button>

                            <button
                                onClick={() => onNavigate("login")}
                                style={{
                                    padding: "16px 32px",
                                    fontSize: "1.1rem",
                                    fontWeight: 700,
                                    backgroundColor: "white",
                                    color: "black",
                                    border: "3px solid black",
                                    boxShadow: "6px 6px 0 black",
                                    cursor: "pointer",
                                }}
                            >
                                MEMBER LOGIN
                            </button>
                        </div>
                    </div>

                    {/* RIGHT — POSTER ARTIFACT */}
                    <div
                        className="hidden md:flex"
                        style={{
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "260px",
                                height: "380px",
                                backgroundColor: "black",
                                color: "white",
                                border: "4px solid black",
                                boxShadow: "12px 12px 0 black",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <div className="relative w-full h-full">
                                <img
                                    src="/hero-poster-final.jpg"
                                    alt="Now Showing"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block"
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "16px",
                                        left: 0,
                                        right: 0,
                                        textAlign: "center",
                                        fontSize: "14px",
                                        letterSpacing: "0.2em",
                                        color: "white",
                                        textShadow: "2px 2px 0 black",
                                        fontWeight: 900
                                    }}
                                >
                                    NOW SHOWING
                                </div>
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "0",
                                        left: 0,
                                        right: 0,
                                        backgroundColor: "#d62828",
                                        textAlign: "center",
                                        padding: "12px",
                                        fontWeight: 700,
                                        letterSpacing: "0.1em",
                                        color: "white",
                                        borderTop: "3px solid black"
                                    }}
                                >
                                    EST. 2025
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* What We Do Section */}
            <section className="pt-24 pb-48 px-6 bg-white border-b-4 border-black">
                <div className="container mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl font-black uppercase mb-6 inline-block border-b-8 border-yellow-400">
                            What We Do
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
                        {/* Feature 1 */}
                        <div className="retro-card bg-blue-50 p-8">
                            <div className="bg-blue-500 w-20 h-20 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                                <Users size={40} className="text-white" />
                            </div>
                            <h3 className="text-3xl font-black uppercase mb-4">
                                Create Spaces
                            </h3>
                            <p className="text-lg font-medium leading-relaxed text-gray-800">
                                Create dedicated spaces for your friend groups. It's like a digital living room for your movie marathons.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="retro-card bg-red-50 p-8">
                            <div className="bg-red-500 w-20 h-20 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                                <Share2 size={40} className="text-white" />
                            </div>
                            <h3 className="text-3xl font-black uppercase mb-4">
                                Invite Friends
                            </h3>
                            <p className="text-lg font-medium leading-relaxed text-gray-800">
                                Send retro-style email invitations. No complicated links, just a simple ticket to the show.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="retro-card bg-yellow-50 p-8">
                            <div className="bg-yellow-500 w-20 h-20 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                                <List size={40} className="text-white" />
                            </div>
                            <h3 className="text-3xl font-black uppercase mb-4">
                                Curate Watchlists
                            </h3>
                            <p className="text-lg font-medium leading-relaxed text-gray-800">
                                Build the ultimate collaborative watchlist. Vote on what to watch next and never argue about movies again.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="retro-card bg-green-50 p-8">
                            <div className="bg-green-500 w-20 h-20 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                                <Clapperboard size={40} className="text-white" />
                            </div>
                            <h3 className="text-3xl font-black uppercase mb-4">
                                AI Video Extraction
                            </h3>
                            <p className="text-lg font-medium leading-relaxed text-gray-800">
                                Saw a movie in a reel but forgot the name? Paste the link, and our AI will find and add it to your list instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
