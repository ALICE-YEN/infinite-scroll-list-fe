import React from "react";

const categories = [
  "全部",
  "兒少照護",
  "動物保護",
  "特殊醫病",
  "老人照護",
  "身心障礙服務",
  "婦女關懷",
  "運動發展",
  "教育議題提倡",
  "環境保護",
  "多元族群",
  "媒體傳播",
  "公共議題",
  "文教藝術",
  "社區發展",
  "弱勢扶貧",
  "國際救援",
];

type Props = {
  selected: string;
  onSelect: (val: string) => void;
  onClose: () => void;
};

export default function SubcategoryModal({
  selected,
  onSelect,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
      <div className="bg-white w-full rounded-t-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">選擇類別</h2>
          <button onClick={onClose} className="text-gray-500 text-lg">
            ✕
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`rounded bg-gray-100 px-3 py-2 text-sm ${
                selected === cat
                  ? "bg-red-100 text-red-600 border-red-400"
                  : "text-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
