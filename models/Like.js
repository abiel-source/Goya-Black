import { Schema, model, models } from "mongoose";

const LikeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    paintingId: {
      type: Schema.Types.ObjectId,
      ref: "Painting",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

LikeSchema.index({ userId: 1, paintingId: 1 }, { unique: true });

const Like = models.Like || model("Like", LikeSchema);
export default Like;
