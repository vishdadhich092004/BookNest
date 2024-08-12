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
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

discussionSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Comment.deleteMany({ _id: { $in: doc.comment } });
  }
});

const Discussion = mongoose.model<DiscussionType>(
  "Discussion",
  discussionSchema
);

export default Discussion;
