"use client";

import { useEffect, useRef } from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
}

export function VideoModal({ isOpen, onClose, src }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      videoRef.current?.pause();
      return;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Demo video"
    >
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-black">
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>

        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay
          className="w-full aspect-video"
          playsInline
        />
      </div>
    </div>
  );
}
