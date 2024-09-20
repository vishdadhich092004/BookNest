import mongoose, { Schema } from "mongoose";
import { ClubType } from "../shared/types";

const clubSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  bannerImgUrl: {
    type: String,
  },
  profileImgUrl: {
    type: String,
  },
});
clubSchema.index({ title: "text", description: "text" });
const Club = mongoose.model<ClubType>("Club", clubSchema);

export default Club;
