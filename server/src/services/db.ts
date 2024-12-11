import mongoose from "mongoose";
import "dotenv/config";
export function db() {
  mongoose
    .connect(process.env.MONGO_URL as string)
    .then(() => {
      console.log("Mongo Connection Successful");
    })
    .catch((err) => {
      console.log("Mongo Connection Issues", err);
    });
}
