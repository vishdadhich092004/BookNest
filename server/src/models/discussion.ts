// Discussion Model
import mongoose, { Schema } from "mongoose";
import { DiscussionType } from "../shared/types";

const discussionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: false,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// discussionSchema.pre("find", function () {
//   this.populate("book");
// });
// Replace text index with regular index
discussionSchema.index({ title: 1, description: 1 });

const Discussion = mongoose.model<DiscussionType>(
  "Discussion",
  discussionSchema
);

export default Discussion;
