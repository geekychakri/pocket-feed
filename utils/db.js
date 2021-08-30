import mongoose from "mongoose";

let isConnected = false;

export const connect = async () => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    // console.log("CONNECTED TO DB");
    isConnected = true;
  }
};
