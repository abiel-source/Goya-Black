import { Schema, model, models } from "mongoose";

const LikeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fragmentId: {
      type: Schema.Types.ObjectId,
      ref: "Fragment",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// CONSTRAINT: One like per user per fragment
LikeSchema.index({ userId: 1, fragmentId: 1 }, { unique: true });

const Like = models.Like || model("Like", LikeSchema);
export default Like;
