import mongoose, { Schema } from "mongoose";
import { UserType } from "../shared/types";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  permissions: [String],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
