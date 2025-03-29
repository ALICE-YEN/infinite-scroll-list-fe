"use client";
import React from "react";

const tabs = ["公益團體", "捐款專案", "義賣商品"];

type Props = {
  selectedTab: string;
  onTabChange: (tab: string) => void;
};

export default function Tabs({ selectedTab, onTabChange }: Props) {
  return (
    <div className="flex border-b border-gray-200 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 py-2 text-center font-medium ${
            selectedTab === tab
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
