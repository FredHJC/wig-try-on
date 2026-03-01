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
        <div className="w-8 h-8 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 mt-4">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700 transition-colors">Shop</Link>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">{wig.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Product info */}
        <div>
          {/* Product image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
            <Image
              src={wig.imageUrl}
              alt={wig.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product details */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
                {wig.color}
              </span>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
                {wig.style}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {wig.name}
            </h1>
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-3xl font-bold text-gray-900">${wig.price.toFixed(2)}</span>
              <span className="text-sm text-green-600 font-medium">Free shipping</span>
            </div>
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              {wig.description}
            </p>

            {/* Buy button */}
            <a
              href={wig.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-500 px-6 py-4 text-sm font-bold text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.045 18.02c.072-.116.187-.124.348-.022 2.116 1.345 4.575 2.018 7.377 2.018 2.287 0 4.568-.58 6.844-1.74.17-.087.315-.04.433.14.118.18.072.33-.14.45a14.725 14.725 0 01-7.073 1.82c-2.825 0-5.389-.66-7.692-1.98-.152-.09-.2-.19-.143-.306l.046-.38z" />
              </svg>
              Buy on Amazon
            </a>
          </div>
        </div>

        {/* Right: Virtual Try-On */}
        <div>
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Virtual Try-On</h2>
                <p className="text-sm text-gray-500">See how this wig looks on you</p>
              </div>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-2 mb-6 text-xs">
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
                !userPhotoPreview
                  ? "bg-pink-600 text-white"
                  : "bg-green-100 text-green-700"
              }`}>
                {userPhotoPreview ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : "1"}
                Upload Photo
              </span>
              <div className="w-4 h-px bg-gray-300" />
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
                userPhotoPreview && !resultImage && !isLoading
                  ? "bg-pink-600 text-white"
                  : resultImage
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-400"
              }`}>
                {resultImage ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : "2"}
                Generate
              </span>
              <div className="w-4 h-px bg-gray-300" />
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
                resultImage
                  ? "bg-pink-600 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}>
                3 Result
              </span>
            </div>

            {/* Upload area or result */}
            {!resultImage && !isLoading && !error ? (
              <div>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  preview={userPhotoPreview}
                />

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={!userPhoto || isLoading}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Generate Try-On
                </button>
              </div>
            ) : (
              <TryOnResult
                resultImage={resultImage}
                isLoading={isLoading}
                error={error}
                amazonUrl={wig.amazonUrl}
                onRetry={handleGenerate}
                onReset={() => {
                  setResultImage(null);
                  setError(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
