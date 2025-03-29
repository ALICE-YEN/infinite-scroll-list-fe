import React from "react";

type Props = {
  name: string;
  description: string;
  imageUrl: string;
};

export default function ListItem({ name, description, imageUrl }: Props) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded bg-white shadow-sm">
      <img
        src={imageUrl}
        alt={name}
        className="w-12 h-12 rounded object-cover"
      />
      <div>
        <h3 className="font-medium text-sm text-gray-900">{name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
