"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import List from "@/app/donations/components/List";
import Tabs from "@/app/donations/components/Tabs";
import Search from "@/app/donations/components/Search";
import SubcategoryModal from "@/app/donations/components/SubcategoryModal";
import type { DonationItem } from "@/types/interfaces";

export default function DonationsPage() {
  const [items, setItems] = useState<DonationItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState("公益團體");
  const [subcategory, setSubcategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubSelector, setShowSubSelector] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:3001/donations?type=project&page=${page}&limit=10`
      );
      const newItems = res.data.data;
      const total = res.data.total;

      setItems((prev) => [...prev, ...newItems]);
      setHasMore(items.length + newItems.length < total);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, items]);

  // IntersectionObserver 觸發下一頁
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchData();
        }
      },
      { threshold: 1.0 }
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

      <Tabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

      <div className="flex items-center justify-between px-4 py-2">
        <button
          className="flex items-center px-3 py-1 bg-gray-100 rounded text-sm"
          onClick={() => setShowSubSelector(true)}
        >
          {subcategory} ▼
        </button>

        <Search
          onSearch={(val) => {
            setSearchQuery(val);
            setItems([]);
            setPage(1);
            setHasMore(true);
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
