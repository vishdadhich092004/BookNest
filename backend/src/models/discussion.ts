import mongoose, { Schema } from "mongoose";
import { DiscussionType } from "../shared/types";
import Comment from "./comment";
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
});

const Discussion = mongoose.model<DiscussionType>(
  "Discussion",
  discussionSchema
);

export default Discussion;
