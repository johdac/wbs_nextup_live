import React from "react";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Layer 1: Base Dark Color */}
      <div className="fixed inset-0 z-0 bg-[#0a0a0a]" />

      {/* Layer 2: Extreme Grain Overlay */}
      {/* Increased opacity and used 'screen' blend mode for more visible white grain */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-heavy-grain opacity-[0.12] mix-blend-screen" />

      {/* Layer 3: Contrast Layer */}
      {/* This layer reinforces the "interesting gray" texture from your image */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-heavy-grain opacity-[0.08] mix-blend-overlay" />

      {/* Layer 4: Subtle Vignette to focus light in center */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,transparent_100%)]" />

      {/* Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
