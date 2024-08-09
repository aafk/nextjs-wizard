import { Schema } from "mongoose";
import { faker } from "@faker-js/faker";

export function createFakeCustomer() {
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    image: faker.image.avatar(),
    createdAt: faker.date.past(),
  };
}

const Customer = new Schema(
  {
    name: String,
    email: String,
    image: String,
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
    collection: "customer",
  }
);

export default Customer;
