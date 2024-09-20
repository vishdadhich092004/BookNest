import mongoose, { Schema } from "mongoose";
import { CommentType } from "../shared/types";

export const commentSchema = new Schema({
  discussionId: {
    type: Schema.Types.ObjectId,
    ref: "Discussion",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: new Date(),
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
commentSchema.index({ text: "text" });
const Comment = mongoose.model<CommentType>("Comment", commentSchema);

export default Comment;
