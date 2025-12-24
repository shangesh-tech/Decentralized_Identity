"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Edit2,
  Trash2,
  Globe,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Plus,
  Rocket,
  Copy,
  Check
} from "lucide-react";
import toast from "react-hot-toast";

// Demo: Single portfolio data
const userPortfolio = {
  id: "1",
  name: "Jai Menon",
  role: "Blockchain & Web3 Engineer",
  location: "Bangalore, India",
  headline: "Building MEV-safe DEXs and multi-chain wallets.",
  createdAt: "Dec 18, 2025",
  email: "jai.menon@example.com",
  website: "https://jaimenon.xyz",
};

export default function Home() {
  // Toggle this to test Empty vs. Created states (Changed default to false to match "No portfolio" logic)
  const [hasPortfolio, setHasPortfolio] = useState(false);

  // Mock delete function
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete your on-chain portfolio?")) {
      setHasPortfolio(false);
      toast.success("Portfolio deleted successfully");
    }
  };

  // Copy URL function with Toast
  const handleCopyUrl = () => {
    const url = `${window.location.origin}/portfolio/${userPortfolio.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Public URL copied to clipboard!", {
      icon: '🔗',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-4 py-10 md:px-8">
      {hasPortfolio ? (
        <div className="flex w-full max-w-lg flex-col items-center justify-center text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
            <Rocket className="h-10 w-10 text-gray-900" />
          </div>

          <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            No portfolio yet
          </h1>
          <p className="mb-8 max-w-sm text-gray-500">
            You haven&apos;t created your on-chain portfolio yet. Build your Web3
            profile in minutes and share it with the world.
          </p>

          <Link
            href="/new"
            onClick={() => setHasPortfolio(true)} // Just for demo simulation
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-black hover:shadow-lg sm:w-auto gap-2"
          >
            <Plus className="h-5 w-5" /> Create my portfolio
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Portfolio</h2>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-200/50">
            {/* Header / Cover area */}
            <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-700 sm:h-40" />

            <div className="relative px-6 pb-8 sm:px-10">
              {/* Avatar - overlapping the cover */}
              <div className="absolute -top-12 sm:-top-16">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gray-900 text-2xl font-bold text-white shadow-md sm:h-32 sm:w-32 sm:text-4xl">
                  {userPortfolio.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>

              {/* Action Buttons (Top Right) */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                  title="Copy Link"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <Link
                  href="/new"
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <Edit2 className="h-4 w-4 text-gray-500" /> Update
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>

              {/* Main Content */}
              <div className="mt-4 sm:mt-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {userPortfolio.name}
                </h1>
                <p className="text-lg font-medium text-gray-600">
                  {userPortfolio.role}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {userPortfolio.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> Joined {userPortfolio.createdAt}
                  </span>
                </div>

                <div className="my-6 border-t border-gray-100" />

                <p className="text-base leading-relaxed text-gray-700">
                  {userPortfolio.headline}
                </p>

                {/* Quick Links */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={userPortfolio.website}
                    target="_blank"
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
                  >
                    <Globe className="h-4 w-4" /> Website
                  </a>
                  <a
                    href={`mailto:${userPortfolio.email}`}
                    target="_blank"
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
                  >
                    <Mail className="h-4 w-4" /> Email
                  </a>
                  <Link
                    href={`/portfolio/${userPortfolio.id}`}
                    className="flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-black transition"
                  >
                    View Public Page <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
