import React from 'react';

interface HeroPosterProps {
    imageSrc: string;
    imageAlt?: string;
}

export const HeroPoster: React.FC<HeroPosterProps> = ({
    imageSrc,
    imageAlt = "Now Showing"
}) => {
    return (
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
                    src={imageSrc}
                    alt={imageAlt}
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
    );
};
