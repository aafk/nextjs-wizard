import { models } from "mongoose";
import { formatCurrency, getMonthName } from "../app/lib/utils";
import connectMongo from "@/utils/connect-mongo";

export async function fetchRevenue() {
  try {
    await connectMongo();
    const data = await models.Revenue.find().sort({ month: -1 }).limit(12);
    const res = data.map((item) => {
      item = item.toJSON();
      item.month = getMonthName(item.month);
      return item;
    });

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
    const invoicePromise = models.Invoice.aggregate([
      {
        $group: {
          _id: null,
          paid: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    const data: any[] = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoicePromise,
    ]);

    const numberOfInvoices = data[0] || 0;
    const numberOfCustomers = data[1] || 0;
    const totalPaidInvoices = formatCurrency(data[2]?.[0].paid ?? "0");
    const totalPendingInvoices = formatCurrency(data[2]?.[0].pending ?? "0");

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

    const data = await models.Invoice.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer_info",
        },
      },
      {
        $unwind: "$customer_info",
      },
      {
        $match: {
          $or: [
            { "customer_info.name": { $regex: query, $options: "i" } },
            { "customer_info.email": { $regex: query, $options: "i" } },
            { amount: { $regex: query, $options: "i" } },
            { createdAt: { $regex: query, $options: "i" } },
            { status: { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $facet: {
          items: [
            {
              $project: {
                _id: 0,
                id: { $toString: "$_id" },
                amount: 1,
                createdAt: 1,
                status: 1,
                name: "$customer_info.name",
                email: "$customer_info.email",
                image: "$customer_info.image",
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $skip: offset,
            },
            {
              $limit: ITEMS_PER_PAGE,
            },
          ],
          count: [{ $count: "count" }],
        },
      },
    ]);
    if (data.length === 0 || data[0].count.length === 0) {
      return { items: [], pages: 0 };
    }
    const [
      {
        items = [],
        count: [{ count = 0 }],
      },
    ] = data;
    const pages = Math.ceil(count / ITEMS_PER_PAGE);
    return { items, pages };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    await connectMongo();
    const data = await models.Invoice.findById(id).populate(
      "customer",
      "",
      "Customer"
    );
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

export async function fetchFilteredCustomers(query: string, page: number = 0) {
  "use server";
  try {
    await connectMongo();
    const offset = Math.max(page, 0) * ITEMS_PER_PAGE;
    const data = await models.Customer.aggregate([
      {
        $lookup: {
          from: "invoices",
          localField: "_id",
          foreignField: "customer",
          as: "invoices",
        },
      },
      {
        $match: {
          $or: [
            {
              name: {
                $regex: query,
                $options: "i",
              },
            },
            {
              email: {
                $regex: query,
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$invoices",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            id: "$_id",
            name: "$name",
            email: "$email",
            image: "$image",
          },
          total_invoices: {
            $sum: {
              $cond: [
                {
                  $ifNull: ["$invoices._id", false],
                },
                1,
                0,
              ],
            },
          },
          total_pending: {
            $sum: {
              $cond: [
                {
                  $eq: ["$invoices.status", "pending"],
                },
                "$invoices.amount",
                0,
              ],
            },
          },
          total_paid: {
            $sum: {
              $cond: [
                {
                  $eq: ["$invoices.status", "paid"],
                },
                "$invoices.amount",
                0,
              ],
            },
          },
        },
      },
      {
        $facet: {
          items: [
            {
              $project: {
                _id: 0,
                id: {
                  $toString: "$_id.id",
                },
                name: "$_id.name",
                email: "$_id.email",
                image: "$_id.image",
                total_invoices: 1,
                total_pending: 1,
                total_paid: 1,
              },
            },
            {
              $sort: {
                name: 1,
              },
            },
            {
              $skip: offset,
            },
            {
              $limit: ITEMS_PER_PAGE,
            },
          ],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    if (data.length === 0 || data[0].count.length === 0) {
      return { items: [], pages: 0 };
    }

    const [
      {
        items = [],
        count: [{ count = 0 }],
      },
    ] = data;

    const customers = items.map((customer: any) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    const pages = Math.ceil(count / ITEMS_PER_PAGE);
    return { items: customers, pages };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}
