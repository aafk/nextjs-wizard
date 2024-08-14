"use client";

import { useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedCustomersTable } from "@/app/lib/definitions";
import CustomerListItem from "@/ui/section/CustomerListItem";
import CustomerTableRow from "@/ui/section/CustomerTableRow";
import Loader from "@/ui/Loader";

type ItemsProps = {
  query: string;
  totalPages: number;
  initialItems: FormattedCustomersTable[];
  fetchItems: (
    query: string,
    currentPage?: number
  ) => Promise<{ items: FormattedCustomersTable[]; pages: number }>;
};

export default function CustomersTable({
  query,
  totalPages,
  initialItems,
  fetchItems,
}: ItemsProps) {
  const fetching = useRef(false);
  const [pages, setPages] = useState([initialItems]);
  const items = pages.flatMap((page) => page);

  const loadMore = async (page: number) => {
    if (!fetching.current) {
      try {
        fetching.current = true;
        const { items } = await fetchItems(query, page);
        setPages((prev) => [...prev, items]);
      } finally {
        fetching.current = false;
      }
    }
  };

  return (
    <InfiniteScroll
      pageStart={0}
      hasMore={pages.length < totalPages}
      loadMore={loadMore}
      loader={<Loader key={0} />}
    >
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-100 p-2 md:pt-0">
              <div className="md:hidden">
                {items.map((customer) => (
                  <CustomerListItem key={customer.id} customer={customer} />
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-100 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Invoices
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Pending
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Total Paid
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {items.map((customer) => (
                    <CustomerTableRow key={customer.id} customer={customer} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </InfiniteScroll>
  );
}
