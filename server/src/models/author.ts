import mongoose from "mongoose";
const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    biography: String,
    birthDate: Date,
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    profileImageUrl: String,
  },
  { timestamps: true }
);
export const Author = mongoose.model("Author", authorSchema);
