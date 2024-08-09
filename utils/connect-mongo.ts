import mongoose, { model, models } from "mongoose";
import Customer from "./models/customer";
import Invoice from "./models/invoice";
import Revenue from "./models/revenue";
import User from "./models/user";

const MONGO_URI = process.env.MONGODB_URI;

const cached: {
  connection?: typeof mongoose;
  promise?: Promise<typeof mongoose>;
} = {};

async function connectMongo() {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGO_URI, opts);
  }
  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }

  for (const item of [
    { name: "User", model: User },
    { name: "Customer", model: Customer },
    { name: "Invoice", model: Invoice },
    { name: "Revenue", model: Revenue },
  ]) {
    if (!models[item.name]) {
      model(item.name, item.model);
    }
  }

  console.log("Database successfully connected");

  return cached.connection;
}

export default connectMongo;
