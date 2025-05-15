import React from "react";

type Props = {
  name: string;
  description: string;
  imageUrl: string;
  style?: React.CSSProperties;
};

export default function ListItem({
  name,
  description,
  imageUrl,
  style,
}: Props) {
  return (
    <div
      className="flex items-start space-x-3 p-3 rounded bg-white shadow-sm"
      style={style}
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-12 h-12 rounded object-cover flex-shrink-0"
      />
      <div className="overflow-hidden">
        <h3 className="font-medium text-sm text-gray-900 truncate">{name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
