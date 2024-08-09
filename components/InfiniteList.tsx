"use client";

import { useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import type { Item } from "@/app/types";

type ItemsProps = {
  initialItems: Item[];
  fetchItems: (page?: number) => Promise<Item[]>;
};

export default function InfiniteList({ initialItems, fetchItems }: ItemsProps) {
  const fetching = useRef(false);
  const [pages, setPages] = useState([initialItems]);
  const items = pages.flatMap((page) => page);

  const loadMore = async (page: number) => {
    if (!fetching.current) {
      try {
        fetching.current = true;

        const data = await fetchItems(page);
        setPages((prev) => [...prev, data]);
      } finally {
        fetching.current = false;
      }
    }
  };

  return (
    <InfiniteScroll
      hasMore
      pageStart={0}
      loadMore={loadMore}
      loader={
        <span key={0} className="loader">
          Loading ...
        </span>
      }
      element="main"
    >
      {items.map((item, index) => (
        <span key={index}>{item.name}</span>
      ))}
    </InfiniteScroll>
  );
}
