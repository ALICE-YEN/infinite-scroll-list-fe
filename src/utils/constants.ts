import { DonationType } from "@/types/enum";

export const TABS = [
  { id: DonationType.GROUP, name: "公益團體" },
  { id: DonationType.PROJECT, name: "捐款專案" },
  { id: DonationType.PRODUCT, name: "義賣商品" },
];

export const ALL_CATEGORY_OBJECT = {
  id: 0,
  name: "全部",
  description: "All",
};

export const LIMIT = 10; // API 一頁幾個

export const ITEM_HEIGHT = 72; // ListItem 高度
export const BUFFER = 5; // virtualized
