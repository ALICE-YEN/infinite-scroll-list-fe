import React from "react";
import ListItem from "./ListItem";

type Item = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

type Props = {
  items: Item[];
  itemWrapperStyle?: React.CSSProperties;
};

export default function List({ items, itemWrapperStyle }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ListItem
          key={item.id}
          style={itemWrapperStyle}
          name={item.name}
          description={item.description}
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  );
}
