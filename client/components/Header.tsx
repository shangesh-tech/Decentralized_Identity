"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo / brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-gray-900">
              Decentralized Portfolio
            </span>
            <span className="text-[11px] text-gray-500">
              On‑chain profile builder
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-black md:inline-block"
          >
            Connect Wallet
          </Link>
        </div>
      </div>
    </header>
  );
}
