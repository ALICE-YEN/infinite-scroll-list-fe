"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import List from "@/app/donations/components/List";
import Tabs from "@/app/donations/components/Tabs";
import Search from "@/app/donations/components/Search";
import SubcategoryModal from "@/app/donations/components/SubcategoryModal";
import type { DonationItem } from "@/types/interfaces";
import { DonationType } from "@/types/enum";

const tabs = [
  { id: DonationType.GROUP, name: "公益團體" },
  { id: DonationType.PROJECT, name: "捐款專案" },
  { id: DonationType.PRODUCT, name: "義賣商品" },
];

const categories = [
  {
    id: 0,
    name: "全部",
    description: "All",
  },
  {
    id: 1,
    name: "教育議題提倡",
    description: "Projects related to education",
  },
  {
    id: 2,
    name: "特殊醫病",
    description: "Healthcare and medical-related donations",
  },
  {
    id: 3,
    name: "環境保護",
    description: "Environmental protection and sustainability",
  },
  {
    id: 4,
    name: "動物保護",
    description: "Animal rescue and care",
  },
  {
    id: 5,
    name: "社區發展",
    description: "Community development and support",
  },
];

export default function DonationsPage() {
  const [items, setItems] = useState<DonationItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState<DonationType>(
    DonationType.GROUP
  );
  const [subcategory, setSubcategory] = useState<number>(0); // 用 0 來當作全部是不是不好？
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSubSelector, setShowSubSelector] = useState<boolean>(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const LIMIT = 10;

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [selectedTab, searchQuery, subcategory]);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const params = new URLSearchParams({
        type: selectedTab,
        page: page.toString(),
        limit: LIMIT.toString(),
        search: searchQuery, // encodeURIComponent
      });

      if (subcategory !== 0) {
        params.append("category", subcategory.toString());
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/donations?${params.toString()}`
      );

      const newItems = res.data.data;
      const total = res.data.meta.total;

      setItems((prev) => [...prev, ...newItems]);
      setHasMore(items.length + newItems.length < total);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, items, selectedTab, subcategory, searchQuery]);

  // 利用 IntersectionObserver 監聽下方元素進入 viewport 時載入下一頁
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchData();
        }
      },
      { threshold: 1.0 } // 被觀察元素有多少比例進入 viewport 時，才會觸發 callback，1.0 代表完全進入
    );

    if (observerRef.current) {
      intersectionObserver.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        intersectionObserver.unobserve(observerRef.current);
      }
    };
  }, [fetchData, hasMore, loading]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white text-center py-3 font-semibold sticky top-0 z-50">
        所有捐款項目
      </header>

      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      <div className="flex items-center justify-between px-4 py-2">
        <button
          className="flex items-center px-3 py-1 bg-gray-100 rounded text-sm"
          onClick={() => setShowSubSelector(true)}
        >
          {categories.find((category) => category.id === subcategory)?.name}▼
        </button>

        <Search
          onSearch={(val) => {
            setSearchQuery(val);
          }}
        />
      </div>

      <div className="px-4 pb-8">
        <List items={items} />
        {loading && (
          <p className="text-center text-sm text-gray-400">載入中...</p>
        )}
        <div ref={observerRef} className="h-4" />
      </div>

      {showSubSelector && (
        <SubcategoryModal
          categories={categories}
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
