import { ReviewType } from "../shared/types";
import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Book",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.index({ text: "text" });
const Review = mongoose.model<ReviewType>("Review", reviewSchema);

export default Review;
