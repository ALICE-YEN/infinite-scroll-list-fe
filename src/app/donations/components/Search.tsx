"use client";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Search({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="px-4 py-2">
      {!searching ? (
        <button onClick={() => setSearching(true)} className="text-gray-600">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            placeholder="搜尋"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
          />
          <button
            onClick={() => {
              setQuery("");
              setSearching(false);
              onSearch("");
            }}
          >
            取消
          </button>
        </div>
      )}
    </div>
  );
}
