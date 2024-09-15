import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { UserType } from "../shared/types";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function (this: UserType) {
      return !this.googleId;
    },
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
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
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  picture: String,
  favoriteGenres: [String],
  readBooks: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  ratedBooks: [
    {
      bookId: { type: Schema.Types.ObjectId, ref: "Book" },
      rating: Number,
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
