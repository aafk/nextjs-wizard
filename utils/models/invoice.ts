import { Schema } from "mongoose";
import { faker } from "@faker-js/faker";

const { ObjectId } = Schema;

export interface IInvoice {
  customer: typeof ObjectId;
  amount: number;
  status: string;
  createdAt: Date;
}

export function createFakeInvoice(customerIds: (typeof ObjectId)[]): IInvoice {
  return {
    customer: customerIds[faker.number.int(customerIds.length - 1)],
    amount: faker.number.int({ min: 10, max: 100 }),
    status: ["pending", "paid"][faker.number.int(1)],
    createdAt: faker.date.past(),
  };
}

const Invoice = new Schema(
  {
    customer: ObjectId,
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
  }
);

export default Invoice;
