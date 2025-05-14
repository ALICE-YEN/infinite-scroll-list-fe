"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import List from "@/app/donations/components/List";
import Tabs from "@/app/donations/components/Tabs";
import Search from "@/app/donations/components/Search";
import SubcategoryModal from "@/app/donations/components/SubcategoryModal";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { DonationItem, Category } from "@/types/interfaces";
import { DonationType } from "@/types/enum";

const tabs = [
  { id: DonationType.GROUP, name: "公益團體" },
  { id: DonationType.PROJECT, name: "捐款專案" },
  { id: DonationType.PRODUCT, name: "義賣商品" },
];

const ALL_CATEGORY_OBJECT = {
  id: 0,
  name: "全部",
  description: "All",
};

export default function DonationsPage() {
  const LIMIT = 10;

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
