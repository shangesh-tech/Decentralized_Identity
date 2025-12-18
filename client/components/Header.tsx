"use client";

import Link from "next/link";
import { FaGithub, FaTwitter } from "react-icons/fa";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo / brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900 text-xs font-semibold text-white">
            W3
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-900">
              Web3 Portfolio
            </span>
            <span className="text-[11px] text-gray-500">
              On‑chain builder profile
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
            <a href="#portfolio" className="hover:text-gray-900">
              Portfolio
            </a>
            <a href="#projects" className="hover:text-gray-900">
              Projects
            </a>
            <a href="#contact" className="hover:text-gray-900">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3 text-gray-500">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-1.5 hover:bg-gray-100 hover:text-gray-900"
              aria-label="GitHub"
            >
              <FaGithub className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-1.5 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Twitter"
            >
              <FaTwitter className="h-4 w-4" />
            </a>
          </div>

          <Link
            href="/portfolio"
            className="hidden rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-black md:inline-block"
          >
            Launch builder
          </Link>
        </div>
      </div>
    </header>
  );
}
