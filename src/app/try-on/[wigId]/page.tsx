"use client";

import { useEffect, useState, useCallback, use } from "react";
import Image from "next/image";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import TryOnResult from "@/components/TryOnResult";
import type { Wig } from "@/lib/wigs";

export default function TryOnPage({
  params,
}: {
  params: Promise<{ wigId: string }>;
}) {
  const { wigId } = use(params);
  const [wig, setWig] = useState<Wig | null>(null);
  const [userPhoto, setUserPhoto] = useState<File | null>(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/wigs/${wigId}`)
      .then((r) => r.json())
      .then(setWig)
      .catch(() => setWig(null));
  }, [wigId]);

  const handleImageSelect = useCallback((file: File) => {
    if (!file) {
      setUserPhoto(null);
      setUserPhotoPreview(null);
      setResultImage(null);
      setError(null);
      return;
    }
    setUserPhoto(file);
    setResultImage(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setUserPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!userPhoto || !wig) return;

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const formData = new FormData();
      formData.append("userImage", userPhoto);
      formData.append("wigId", wig.id);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate try-on image");
      }

      const data = await response.json();
      setResultImage(`data:${data.mimeType};base64,${data.imageBase64}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, [userPhoto, wig]);

  if (!wig) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading wig details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to catalog
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
            <Image
              src={wig.imageUrl}
              alt={wig.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{wig.name}</h1>
            <p className="text-gray-500 mt-1">
              {wig.color} · {wig.style} · ${wig.price.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1: Upload Photo */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              1. Your Photo
            </h2>
            <ImageUpload
              onImageSelect={handleImageSelect}
              preview={userPhotoPreview}
            />
          </div>

          {/* Step 2: Wig Preview */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              2. Selected Wig
            </h2>
            <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50">
              <Image
                src={wig.imageUrl}
                alt={wig.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Step 3: Result */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              3. Result
            </h2>
            {!resultImage && !isLoading && !error ? (
              <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                <svg
                  className="w-12 h-12 text-gray-300 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                  />
                </svg>
                <p className="text-sm text-gray-400">
                  AI result will appear here
                </p>
              </div>
            ) : (
              <TryOnResult
                resultImage={resultImage}
                isLoading={isLoading}
                error={error}
                amazonUrl={wig.amazonUrl}
                onRetry={handleGenerate}
              />
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={!userPhoto || isLoading}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                  />
                </svg>
                Generate Try-On
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
