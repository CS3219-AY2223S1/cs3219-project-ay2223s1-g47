import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

let connection: MongoClient;
let mongoServer: MongoMemoryServer;

const connect = async () => {
  mongoServer = await MongoMemoryServer.create({instance:{ip:'127.0.0.1',port:27017,dbName:'user-service'}});
  connection = await MongoClient.connect(mongoServer.getUri(), {});
};

const close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

const clear = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
export default { connect, close, clear };
