"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Tabs from "@/app/donations/components/Tabs";
import Search from "@/app/donations/components/Search";
import SubcategoryModal from "@/app/donations/components/SubcategoryModal";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import {
  TABS,
  ALL_CATEGORY_OBJECT,
  LIMIT,
  ITEM_HEIGHT,
  BUFFER,
} from "@/utils/constants";
import type { DonationItem, Category } from "@/types/interfaces";
import { DonationType } from "@/types/enum";

export default function DonationsPage() {
  const [items, setItems] = useState<DonationItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState<DonationType>(
    DonationType.GROUP
  );
  const [subcategory, setSubcategory] = useState<number>(
    ALL_CATEGORY_OBJECT.id
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSubSelector, setShowSubSelector] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

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

  const intersectionRef = useIntersectionObserver(fetchData);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`
        );

        // 預防 API 回傳中有 id === ALL_CATEGORY_ID 的分類，預排除這些項目以避免重複
        const filteredCategories = res.data.filter(
          (cat: Category) => cat.id !== ALL_CATEGORY_OBJECT.id
        );

        setCategories([ALL_CATEGORY_OBJECT, ...filteredCategories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [selectedTab, searchQuery, subcategory]);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.getBoundingClientRect().height);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const totalHeight = items.length * ITEM_HEIGHT;
  const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT);
  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  const endIndex = Math.min(startIndex + visibleCount + BUFFER, items.length);
  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white text-center py-3 font-semibold sticky top-0 z-50">
        Virtualized 捐款項目
      </header>

      <Tabs
        tabs={TABS}
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

        <Search onSearch={(val) => setSearchQuery(val)} />
      </div>

      <div
        ref={containerRef}
        className="px-4 overflow-y-auto"
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        style={{ height: "calc(100vh - 148.5px)" }}
      >
        {/* relative：提供定位基準，不讓絕對定位跑到頁面外面 */}
        {/* totalHeight：讓 scroll bar 看起來像整份資料都存在一樣 */}
        <div style={{ height: totalHeight, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: startIndex * ITEM_HEIGHT, // 模擬 item 應該出現在整份清單的絕對位置
              left: 0,
              right: 0,
            }}
          >
            {visibleItems.map((item) => (
              <div
                key={item.id}
                style={{
                  height: ITEM_HEIGHT,
                  marginBottom: "12px",
                }}
                className="flex items-start space-x-3 p-3 rounded bg-white shadow-sm"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <h3 className="font-medium text-sm text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {loading && (
          <p className="text-center text-sm text-gray-400">載入中...</p>
        )}
        <div ref={intersectionRef} className="h-4" />
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
