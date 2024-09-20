import mongoose, { Schema } from "mongoose";
import { BookType } from "../shared/types";
const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: String,
  },
  coverPageUrl: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

bookSchema.index({
  title: "text",
  author: "text",
  description: "text",
  genre: "text",
});
const Book = mongoose.model<BookType>("Book", bookSchema);

export default Book;
