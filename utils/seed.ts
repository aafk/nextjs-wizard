import { config } from "dotenv";
config();

import { models } from "mongoose";
import { faker } from "@faker-js/faker";
import { createFakeUser } from "./models/user";
import { createFakeRevenue } from "./models/revenue";
import { createFakeCustomer } from "./models/customer";
import { createFakeInvoice } from "./models/invoice";
import connectMongo from "./connect-mongo";

async function setup() {
  await connectMongo();

  const hasData = await models.Invoice.find().countDocuments();

  if (hasData > 0) {
    console.log("Database already exists with data");
    return;
  }

  await models.User.insertMany(
    faker.helpers.multiple(createFakeUser, {
      count: 30,
    })
  );

  console.log("User done");

  const dates = faker.date.betweens({
    from: "2020-01-01T00:00:00.000Z",
    to: "2030-01-01T00:00:00.000Z",
    count: 40,
  });

  let revenues: any[] = [];

  [...Array(40)].forEach((_, i) => {
    revenues.push(createFakeRevenue(dates[i]));
  });

  await models.Revenue.insertMany(revenues);

  console.log("Revenue done");

  await models.Customer.insertMany(
    faker.helpers.multiple(createFakeCustomer, {
      count: 50,
    })
  );

  console.log("Customer done");

  const customers = await models.Customer.find();
  const customerIds = customers.map((customer: { _id: string }) =>
    customer._id.toString()
  );

  let invoices: any[] = [];

  [...Array(60)].forEach(() => {
    invoices.push(createFakeInvoice(customerIds));
  });

  await models.Invoice.insertMany(invoices);

  console.log("Invoice done");
}

setup().catch(console.log).finally(process.exit);
