"use client";

import React, { useState } from "react";
import List from "@/app/donations/components/List";
import Tabs from "@/app/donations/components/Tabs";
import Search from "@/app/donations/components/Search";
import SubcategoryModal from "@/app/donations/components/SubcategoryModal";

const mockItems = Array(20)
  .fill(0)
  .map((_, idx) => ({
    id: idx.toString(),
    name: "財團法人流浪動物基金會",
    description: "團體簡介團體簡介團體簡介團體簡介",
    imageUrl: "/logo.png",
  }));

export default function DonationsPage() {
  const [selectedTab, setSelectedTab] = useState("公益團體");
  const [searchQuery, setSearchQuery] = useState("");
  const [subcategory, setSubcategory] = useState("全部");
  const [showSubSelector, setShowSubSelector] = useState(false);

  const filteredItems = searchQuery
    ? mockItems.filter((item) => item.name.includes(searchQuery))
    : mockItems;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white text-center py-3 font-semibold sticky top-0 z-50">
        所有捐款項目
      </header>

      <Tabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

      <div className="flex items-center justify-between px-4 py-2">
        <button
          className="flex items-center px-3 py-1 bg-gray-100 rounded text-sm"
          onClick={() => setShowSubSelector(true)}
        >
          {subcategory} ▼
        </button>

        <Search onSearch={setSearchQuery} />
      </div>

      <div className="px-4 pb-8">
        <List items={filteredItems} />
      </div>

      {showSubSelector && (
        <SubcategoryModal
          selected={subcategory}
          onSelect={(val) => {
            setSubcategory(val);
            setShowSubSelector(false);
          }}
          onClose={() => setShowSubSelector(false)}
        />
      )}
    </div>
  );
}
