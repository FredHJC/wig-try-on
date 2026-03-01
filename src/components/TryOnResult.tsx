"use client";

import Image from "next/image";

interface TryOnResultProps {
  resultImage: string | null;
  isLoading: boolean;
  error: string | null;
  amazonUrl: string;
  onRetry: () => void;
  onReset: () => void;
}

export default function TryOnResult({
  resultImage,
  isLoading,
  error,
  amazonUrl,
  onRetry,
  onReset,
}: TryOnResultProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full aspect-[3/4] rounded-xl border border-gray-200 bg-white">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium text-gray-700">
          Generating your look...
        </p>
        <p className="text-xs text-gray-400 mt-1">This takes about 10 seconds</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full aspect-[3/4] rounded-xl border border-red-200 bg-red-50">
        <svg
          className="w-10 h-10 text-red-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <p className="text-sm font-medium text-red-700">Generation failed</p>
        <p className="text-xs text-red-500 mt-1 text-center px-6 max-w-xs">{error}</p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={onRetry}
            className="text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onReset}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (!resultImage) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-pink-200 shadow-lg">
        <Image
          src={resultImage}
          alt="Your virtual try-on result"
          fill
          className="object-cover"
        />
      </div>

      {/* Action buttons */}
      <div className="w-full space-y-3 mt-5">
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-500 px-6 py-4 text-sm font-bold text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.045 18.02c.072-.116.187-.124.348-.022 2.116 1.345 4.575 2.018 7.377 2.018 2.287 0 4.568-.58 6.844-1.74.17-.087.315-.04.433.14.118.18.072.33-.14.45a14.725 14.725 0 01-7.073 1.82c-2.825 0-5.389-.66-7.692-1.98-.152-.09-.2-.19-.143-.306l.046-.38z" />
          </svg>
          Buy This Wig on Amazon
        </a>
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Regenerate
          </button>
          <button
            onClick={onReset}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            New Photo
          </button>
        </div>
      </div>
    </div>
  );
}
