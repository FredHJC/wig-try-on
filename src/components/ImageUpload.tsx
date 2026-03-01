"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  preview: string | null;
}

type InputMode = "upload" | "camera";

export default function ImageUpload({
  onImageSelect,
  preview,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<InputMode>("upload");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
    setCameraError(null);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
        };
      }
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera permission and try again."
          : err instanceof DOMException && err.name === "NotFoundError"
          ? "No camera found. Please connect a camera or use file upload."
          : "Unable to access camera. Please try file upload instead.";
      setCameraError(msg);
    }
  }, []);

  // Clean up camera stream on unmount or when leaving camera mode
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Mirror the image for selfie feel
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "camera-photo.jpg", {
            type: "image/jpeg",
          });
          stopCamera();
          onImageSelect(file);
        }
      },
      "image/jpeg",
      0.92
    );
  }, [onImageSelect, stopCamera]);

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

  // Preview state - show the captured/uploaded photo
  if (preview) {
    return (
      <div className="relative">
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <Image
            src={preview}
            alt="Your photo"
            fill
            className="object-cover"
          />
        </div>
        <button
          onClick={() => {
            onImageSelect(null as unknown as File);
            setMode("upload");
          }}
          className="mt-3 mx-auto block text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Change photo
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Mode toggle */}
      <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
        <button
          onClick={() => { stopCamera(); setMode("upload"); }}
          className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 px-3 rounded-md transition-all ${
            mode === "upload"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upload
        </button>
        <button
          onClick={() => { setMode("camera"); startCamera(); }}
          className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 px-3 rounded-md transition-all ${
            mode === "camera"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Camera
        </button>
      </div>

      {/* Upload mode */}
      {mode === "upload" && (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center w-full aspect-[3/4] rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            isDragging
              ? "border-pink-500 bg-pink-50"
              : "border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          <svg
            className="w-10 h-10 text-gray-400 mb-3"
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
            {isDragging ? "Drop your photo here" : "Upload your photo"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Drag & drop or click to browse
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      )}

      {/* Camera mode */}
      {mode === "camera" && (
        <div className="relative">
          {cameraError ? (
            <div className="flex flex-col items-center justify-center w-full aspect-[3/4] rounded-xl border border-red-200 bg-red-50">
              <svg className="w-10 h-10 text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <p className="text-sm font-medium text-red-700 text-center px-4">
                {cameraError}
              </p>
              <button
                onClick={() => setMode("upload")}
                className="mt-4 text-sm text-pink-600 hover:text-pink-700 font-medium underline"
              >
                Use file upload instead
              </button>
            </div>
          ) : (
            <>
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-gray-200 bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-3" />
                      <p className="text-sm text-white">Starting camera...</p>
                    </div>
                  </div>
                )}
              </div>
              {cameraReady && (
                <button
                  onClick={capturePhoto}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-pink-500 hover:border-pink-600 shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                  aria-label="Take photo"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors" />
                </button>
              )}
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
