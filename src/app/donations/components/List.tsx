import React from "react";
import ListItem from "./ListItem";

type Item = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

export default function List({ items }: { items: Item[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ListItem
          key={item.id}
          name={item.name}
          description={item.description}
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  );
}
