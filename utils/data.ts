import { models } from "mongoose";
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
} from "../app/lib/definitions";
import { formatCurrency, getMonthName } from "../app/lib/utils";
import connectMongo from "@/utils/connect-mongo";

export async function fetchRevenue() {
  try {
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    await connectMongo();
    const data = await models.Revenue.find().sort({ month: -1 }).limit(12);
    const res = data.map((item) => {
      item = item.toJSON();
      item.month = getMonthName(item.month);
      return item;
    });

    // console.log('Data fetch completed after 3 seconds.');

    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    await connectMongo();
    const data = await models.Invoice.find()
      .populate("customer", "", "Customer")
      .limit(5);
    const latestInvoices = data.map((invoice) => {
      invoice = invoice.toJSON();
      invoice.amount = formatCurrency(invoice.amount);
      return invoice;
    });
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    await connectMongo();
    const invoiceCountPromise = models.Invoice.countDocuments();
    const customerCountPromise = models.Customer.countDocuments();
    const invoicePaidPromise = models.Invoice.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          amount: {
            $sum: "$amount",
          },
        },
      },
    ]);
    const invoicePendingPromise = models.Invoice.aggregate([
      {
        $match: {
          status: "pending",
        },
      },
      {
        $group: {
          _id: null,
          amount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const data: any[] = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoicePaidPromise,
      invoicePendingPromise,
    ]);

    const numberOfInvoices = Number(data[0] ?? "0");
    const numberOfCustomers = Number(data[1] ?? "0");
    const totalPaidInvoices = formatCurrency(data[2][0].amount ?? "0");
    const totalPendingInvoices = formatCurrency(data[3][0].amount ?? "0");

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    await connectMongo();
    const data = await models.Invoice.find({})
      .sort({ createdAt: -1 })
      .populate("customer", "", "Customer")
      .limit(ITEMS_PER_PAGE)
      .skip(offset);
    const invoices = data.map((item) => item.toJSON());

    return invoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    await connectMongo();
    const count = await models.Invoice.find({}).countDocuments();
    //   const count = await sql`SELECT COUNT(*)
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   WHERE
    //     customers.name ILIKE ${`%${query}%`} OR
    //     customers.email ILIKE ${`%${query}%`} OR
    //     invoices.amount::text ILIKE ${`%${query}%`} OR
    //     invoices.date::text ILIKE ${`%${query}%`} OR
    //     invoices.status ILIKE ${`%${query}%`}
    // `;

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    await connectMongo();
    const data = await models.Invoice.findById(id);

    let invoice = data.toJSON();
    invoice.amount = invoice.amount / 100;

    return invoice;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    await connectMongo();
    const data = await models.Customer.find().sort({ name: 1 });
    const customers = data.map((item) => item.toJSON());

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer: any) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}
