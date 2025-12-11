"use client";

export default function BackgroundGrid() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-[#02040a]">
      
      {/* 1. The Top Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-900/20 rounded-full blur-[120px] opacity-50" />

      {/* 2. The Grid/Dot Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ 
          backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, 
          backgroundSize: '32px 32px' 
        }}
      />
    </div>
  );
}