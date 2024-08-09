import { Schema } from "mongoose";
import { faker } from "@faker-js/faker";

export interface IInvoice {
  customer: string;
  amount: number;
  status: string;
  createdAt: Date;
}

export function createFakeInvoice(customerIds: string[]): IInvoice {
  return {
    customer: customerIds[faker.number.int(customerIds.length - 1)],
    amount: faker.number.int({ min: 10, max: 100 }),
    status: ["pending", "paid"][faker.number.int(1)],
    createdAt: faker.date.past(),
  };
}

const Invoice = new Schema(
  {
    customer: String,
    amount: Number,
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        delete ret._id;
      },
    },
    collection: "invoice",
  }
);

export default Invoice;
