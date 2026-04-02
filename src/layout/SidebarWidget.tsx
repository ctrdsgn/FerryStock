"use client";

import React, { useState, useEffect } from "react";

const quotes = [
  { text: "Hati yang paling tenang adalah hati yang selalu merasa cukup dengan ketetapan-Nya.", author: "" },
  { text: "Jangan biarkan duniamu terlalu bising hingga kamu lupa mendengarkan bisikan doa dalam sujudmu.", author: "" },
  { text: "Allah tidak menjanjikan langit selalu biru, tapi Dia menjanjikan pertolongan di setiap kesulitan.", author: "" },
  { text: "Kadang cara terbaik untuk mendapatkan jawaban adalah dengan berhenti bertanya dan mulai berserah.", author: "" },
  { text: "Seringkali kita terlalu sibuk memikirkan apa yang hilang, sampai lupa mensyukuri apa yang masih ada.", author: "" },
  { text: "Doa bukanlah ban serep yang dikeluarkan saat darurat, tapi kemudi yang mengarahkan perjalanan hidup.", author: "" },
  { text: "Seberat apa pun bebanmu, ingatlah bahwa Allah tidak pernah salah memberikan pundak.", author: "" },
  { text: "Perbaiki hubunganmu dengan Allah, maka Allah akan memperbaiki hubunganmu dengan sesama manusia.", author: "" },
  { text: "Dunia itu hanya sementara, maka jangan sampai kamu menukar akhirat yang kekal dengan kesenangan sesaat.", author: "" },
  { text: "Diam dalam sabar jauh lebih mulia daripada menjelaskan segala hal kepada mereka yang tidak ingin mengerti.", author: "" },
];

export default function SidebarWidget() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setIsAnimating(false);
        // Add sparkles effect
        const newSparkles = Array.from({ length: 5 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100,
        }));
        setSparkles(newSparkles);
        setTimeout(() => setSparkles([]), 1000);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative mx-auto mb-10 w-full max-w-60 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-4 py-5 text-center text-white shadow-lg shadow-brand-500/30"
      onClick={() => {
        setIsAnimating(true);
        setTimeout(() => {
          setQuoteIndex((prev) => (prev + 1) % quotes.length);
          setIsAnimating(false);
        }, 300);
      }}
    >
      {/* Sparkles Effect */}
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="pointer-events-none absolute animate-ping text-xs"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
        >
          ✨
        </span>
      ))}

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-2 text-4xl animate-bounce">📦</div>
        <div className="absolute bottom-2 right-2 text-4xl animate-bounce delay-100">✨</div>
        <div className="absolute top-1/2 left-1 text-2xl animate-pulse">💫</div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Logo/Icon */}
        <div className="mb-3 flex justify-center">
          <div className="relative">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl backdrop-blur-sm transition-transform hover:scale-110 hover:rotate-12">
              🏪
            </span>
            <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-ping">
              <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            </span>
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs">
              ⭐
            </span>
          </div>
        </div>

        {/* Brand Name */}
        <h3 className="mb-1 text-lg font-bold tracking-tight">
          FerryStock
        </h3>
        <p className="mb-3 text-xs text-white/70">
          Inventory Management
        </p>

        {/* Quote Box */}
        <div
          className={`rounded-xl bg-white/15 px-3 py-2.5 backdrop-blur-sm transition-all duration-300 ${
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <p className="text-xs font-medium leading-relaxed">
            {quotes[quoteIndex].text}
          </p>
          {quotes[quoteIndex].author && (
            <p className="mt-1.5 text-[10px] text-white/60">
              — {quotes[quoteIndex].author}
            </p>
          )}
        </div>

        {/* Hint */}
        <p className="mt-2.5 text-[9px] text-white/50">
          👆 Klik untuk quote berikutnya
        </p>
      </div>
    </div>
  );
}
