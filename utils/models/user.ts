import { Schema } from "mongoose";
import { faker } from "@faker-js/faker";
import { hashSync } from "bcrypt";

export type IUser = {
  name: string;
  email: string;
  image: string;
  password: string;
  birthdate: Date;
};

const defaultPassword = "asdfasdf";

export function createFakeUser() {
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    image: faker.image.avatar(),
    password: hashSync(defaultPassword, 10),
    birthdate: faker.date.birthdate(),
    createdAt: faker.date.past(),
  };
}

const User = new Schema(
  {
    name: String,
    email: String,
    image: String,
    password: String,
    birthdate: Date,
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

export default User;
