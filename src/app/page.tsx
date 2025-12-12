"use client";
export const dynamic = "force-dynamic";

import HomePage from "@/p/HomePage";

export default function Home() {
  return (
    <div className=" bg-black/90">
      <main className="pt-0">
        <HomePage />
        {/* All your other page content goes here... */}
      </main>
    </div>
  );
}
