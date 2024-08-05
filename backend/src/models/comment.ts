import mongoose, { Schema } from "mongoose";
import { CommentType } from "../shared/types";

export const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const Comment = mongoose.model<CommentType>("Comment", commentSchema);

export default Comment;
