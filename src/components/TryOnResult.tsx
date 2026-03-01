"use client";

import Image from "next/image";

interface TryOnResultProps {
  resultImage: string | null;
  isLoading: boolean;
  error: string | null;
  amazonUrl: string;
  onRetry: () => void;
}

export default function TryOnResult({
  resultImage,
  isLoading,
  error,
  amazonUrl,
  onRetry,
}: TryOnResultProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl border-2 border-gray-200 bg-gray-50">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-gray-600">
          Generating your look...
        </p>
        <p className="text-xs text-gray-400 mt-1">This takes a few seconds</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl border-2 border-red-200 bg-red-50">
        <svg
          className="w-12 h-12 text-red-400 mb-3"
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
        <p className="text-sm font-medium text-red-600">
          Something went wrong
        </p>
        <p className="text-xs text-red-400 mt-1 text-center px-6">{error}</p>
        <button
          onClick={onRetry}
          className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!resultImage) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden border-2 border-violet-200 shadow-lg">
        <Image
          src={resultImage}
          alt="Try-on result"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex gap-3 mt-4">
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.045 18.02c.072-.116.187-.124.348-.022 2.116 1.345 4.575 2.018 7.377 2.018 2.287 0 4.568-.58 6.844-1.74.17-.087.315-.04.433.14.118.18.072.33-.14.45a14.725 14.725 0 01-7.073 1.82c-2.825 0-5.389-.66-7.692-1.98-.152-.09-.2-.19-.143-.306l.046-.38zm21.097-1.74c-.146-.2-.362-.3-.65-.3-.29 0-.62.12-.99.36-.37.24-.73.57-1.08.99-.35.42-.56.67-.63.75-.07.08-.15.15-.24.21-.09.06-.16.07-.21.03-.05-.04-.03-.14.06-.3.46-.84.7-1.59.72-2.25.02-.66-.2-1-.66-1.02-.32-.02-.74.18-1.26.6-.52.42-.98.94-1.38 1.56a9.224 9.224 0 00-.9 1.83c-.24.63-.35 1.1-.33 1.41l-.06.06c-.06.06-.08.15-.06.27.02.12.07.21.15.27.08.06.19.09.33.09.14 0 .32-.06.54-.18s.38-.24.48-.36c.4-.48.88-1.14 1.44-1.98.56-.84.9-1.36 1.02-1.56.18.06.26.18.24.36a4.04 4.04 0 01-.42 1.38c-.24.48-.38.84-.42 1.08 0 .24.06.42.18.54.12.12.28.18.48.18.2 0 .44-.1.72-.3.28-.2.56-.44.84-.72a8.68 8.68 0 00.72-.84c.2-.26.36-.48.48-.66.12-.18.16-.32.12-.42z" />
          </svg>
          Buy on Amazon
        </a>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}
