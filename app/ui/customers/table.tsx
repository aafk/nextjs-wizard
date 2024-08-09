"use client";

import { useRef, useState } from "react";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { FormattedCustomersTable } from "@/app/lib/definitions";
import InfiniteScroll from "react-infinite-scroller";
import CustomerListItem from "@/ui/section/CustomerListItem";
import CustomerTableRow from "@/ui/section/CustomerTableRow";

type ItemsProps = {
  query: string;
  initialItems: FormattedCustomersTable[];
  fetchItems: (
    query: string,
    page?: number
  ) => Promise<FormattedCustomersTable[]>;
};

export default function CustomersTable({
  query,
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

        const data = await fetchItems(query, page);
        setPages((prev) => [...prev, data]);
      } finally {
        fetching.current = false;
      }
    }
  };

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Customers
      </h1>
      <Search placeholder="Search customers..." />
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                <InfiniteScroll
                  hasMore
                  pageStart={0}
                  loadMore={loadMore}
                  loader={
                    <span key={0} className="loader">
                      Loading ...
                    </span>
                  }
                  element="div"
                >
                  {items.map((customer) => (
                    <CustomerListItem key={customer.id} customer={customer} />
                  ))}
                </InfiniteScroll>
              </div>

              <InfiniteScroll
                hasMore
                pageStart={0}
                loadMore={loadMore}
                loader={
                  <span key={0} className="loader">
                    Loading ...
                  </span>
                }
                element="div"
              >
                <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                  <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
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
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
