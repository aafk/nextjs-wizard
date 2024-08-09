import { Schema } from "mongoose";
import { faker } from "@faker-js/faker";

export interface IRevenue {
  month: string;
  revenue: number;
}

export function createFakeRevenue(date: Date) {
  return {
    month: date.toLocaleDateString("en"),
    revenue: faker.number.int({ min: 10, max: 10000 }),
  };
}

const Revenue = new Schema<IRevenue>(
  {
    month: String,
    revenue: Number,
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
      },
    },
  }
);

export default Revenue;
