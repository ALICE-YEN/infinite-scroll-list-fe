"use client";
import React from "react";
import { DonationType } from "@/types/enum";

type Props = {
  tabs: { id: DonationType; name: string }[];
  selectedTab: DonationType;
  onTabChange: (tab: DonationType) => void;
};

export default function Tabs({ tabs, selectedTab, onTabChange }: Props) {
  return (
    <div className="flex border-b border-gray-200 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2 text-center font-medium ${
            selectedTab === tab.id
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-600"
          }`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
