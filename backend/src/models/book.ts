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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Book = mongoose.model<BookType>("Book", bookSchema);

export default Book;
