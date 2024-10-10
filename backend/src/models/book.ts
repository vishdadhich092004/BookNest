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
    type: Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  genre: {
    type: Schema.Types.ObjectId,
    ref: "Genre",
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

// Remove the text index
bookSchema.index({ title: 1, author: 1, description: 1, genre: 1 });

const Book = mongoose.model<BookType>("Book", bookSchema);

export default Book;
