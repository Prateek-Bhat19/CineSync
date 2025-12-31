import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ExtractionStatusProps {
    isAnalyzing: boolean;
    error: string;
    success: string;
    movieCount?: number;
}

export const ExtractionStatus: React.FC<ExtractionStatusProps> = ({
    isAnalyzing,
    error,
    success,
    movieCount
}) => {
    if (isAnalyzing) {
        return (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-black">
                <Loader2 className="animate-spin" size={24} />
                <span className="font-medium">Analyzing video...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-black">
                <AlertCircle size={24} className="text-red-600" />
                <span className="font-medium text-red-600">{error}</span>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-black">
                <CheckCircle2 size={24} className="text-green-600" />
                <span className="font-medium text-green-600">
                    {success} {movieCount !== undefined && `(${movieCount} movies)`}
                </span>
            </div>
        );
    }

    return null;
};
