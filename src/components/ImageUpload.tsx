"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  preview: string | null;
}

export default function ImageUpload({
  onImageSelect,
  preview,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (preview) {
    return (
      <div className="relative">
        <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-gray-200">
          <Image
            src={preview}
            alt="Your photo"
            fill
            className="object-cover"
          />
        </div>
        <button
          onClick={() => onImageSelect(null as unknown as File)}
          className="mt-3 mx-auto block text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Change photo
        </button>
      </div>
    );
  }

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex flex-col items-center justify-center w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
        isDragging
          ? "border-violet-500 bg-violet-50"
          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <svg
        className="w-12 h-12 text-gray-400 mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 16v-8m0 0l-3 3m3-3l3 3M6.75 20.25h10.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6v12a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
      <p className="text-sm font-medium text-gray-600">
        {isDragging ? "Drop your photo here" : "Upload your selfie"}
      </p>
      <p className="text-xs text-gray-400 mt-1">Drag & drop or click</p>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}
