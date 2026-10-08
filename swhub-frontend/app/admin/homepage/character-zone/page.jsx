"use client";

import { Sparkles } from "lucide-react";

const characters = [
  { name: "Disney", theme: "Magic & Princesses" },
  { name: "Marvel", theme: "Superheroes & Action" },
  { name: "Barbie", theme: "Fashion & Dreams" },
  { name: "Pokemon", theme: "Adventure & Collectibles" },
  { name: "Doraemon", theme: "Gadgets & Fun" },
  { name: "Spiderman", theme: "Hero Adventures" },
];

export default function CharacterZoneAdmin() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Character Zone Configuration
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Curated character hubs where kids and parents discover products by their favorite animated icons.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {characters.map((char) => (
          <div
            key={char.name}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Sparkles size={20} />
                </span>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-bold text-green-700">
                  Live
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{char.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{char.theme}</p>
            </div>

            <div className="mt-6 pt-3 border-t text-xs text-gray-400">
              Assigned automatically via product tags
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}