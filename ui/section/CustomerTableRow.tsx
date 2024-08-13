import Image from "next/image";
import { FormattedCustomersTable } from "@/app/lib/definitions";

export default function CustomerTableRow({
  customer,
}: {
  customer: FormattedCustomersTable;
}) {
  return (
    <tr className="group">
      <td className="whitespace-nowrap bg-gray-100 py-5 pl-4 pr-3 text-sm text-gray-950 group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
        <div className="flex items-center gap-3">
          <Image
            src={customer.image}
            className="rounded-full"
            alt={`${customer.name}'s profile picture`}
            width={28}
            height={28}
          />
          <p>{customer.name}</p>
        </div>
      </td>
      <td className="whitespace-nowrap bg-gray-100 px-4 py-5 text-sm">
        {customer.email}
      </td>
      <td className="whitespace-nowrap bg-gray-100 px-4 py-5 text-sm">
        {customer.total_invoices}
      </td>
      <td className="whitespace-nowrap bg-gray-100 px-4 py-5 text-sm">
        {customer.total_pending}
      </td>
      <td className="whitespace-nowrap bg-gray-100 px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
        {customer.total_paid}
      </td>
    </tr>
  );
}
