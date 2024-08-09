import { fetchFilteredCustomers } from "@/utils/data";
import CustomersTable from "@/app/ui/customers/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  const initialItems = await fetchFilteredCustomers(query, page);

  return (
    <main>
      <CustomersTable
        query={query}
        initialItems={initialItems}
        fetchItems={fetchFilteredCustomers}
      />
    </main>
  );
}
