"use client";

import Link from "next/link";

type Portfolio = {
  id: string;
  name: string;
  role: string;
  location: string;
  headline: string;
  slug: string; // e.g. /portfolio/jai
};

const portfolios: Portfolio[] = [
  {
    id: "1",
    name: "Jai Menon",
    role: "Blockchain & Web3 Engineer",
    location: "Bangalore, India",
    headline: "Building MEV-safe DEXs and multi-chain wallets.",
    slug: "/portfolio/jai-menon",
  },
  {
    id: "2",
    name: "Ananya Rao",
    role: "Smart Contract Auditor",
    location: "Hyderabad, India",
    headline: "Formal verification and security reviews for DeFi protocols.",
    slug: "/portfolio/ananya-rao",
  },
  {
    id: "3",
    name: "Rohit Sharma",
    role: "Full-stack Web3 Developer",
    location: "Pune, India",
    headline: "dApps, account abstraction flows, and zk-based identity.",
    slug: "/portfolio/rohit-sharma",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      {/* Top row: title + create button on the RIGHT */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Web3 builder portfolios
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse existing on-chain portfolios or create a new one in seconds.
          </p>
        </div>

        <Link
          href="/new"
          className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black"
        >
          + Create portfolio
        </Link>
      </div>

      {/* List of existing portfolios */}
      <section aria-label="Existing portfolios">
        {portfolios.length === 0 ? (
          <p className="text-sm text-gray-500">
            No portfolios yet. Click “Create portfolio” to add your first one.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((profile) => (
              <Link
                key={profile.id}
                href={profile.slug}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      {profile.name}
                    </h2>
                    <p className="text-xs text-gray-500">{profile.role}</p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600">
                    {profile.location}
                  </span>
                </div>

                <p className="flex-1 text-sm text-gray-600">
                  {profile.headline}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live portfolio
                  </span>
                  <span className="text-gray-400 group-hover:text-gray-700">
                    View details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
