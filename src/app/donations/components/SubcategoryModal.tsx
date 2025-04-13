import React from "react";

type Props = {
  categories: { id: number; name: string; description: string }[];
  selected: number;
  onSelect: (val: number) => void;
  onClose: () => void;
};

export default function SubcategoryModal({
  categories,
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
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`rounded bg-gray-100 px-3 py-2 text-sm ${
                selected === cat.id
                  ? "bg-red-100 text-red-600 border-red-400"
                  : "text-gray-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
