import { Schema, model, models } from "mongoose";

const CommentLikeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// CONSTRAINT: one like per user per comment
CommentLikeSchema.index({ userId: 1, commentId: 1 }, { unique: true });

const CommentLike =
  models.CommentLike || model("CommentLike", CommentLikeSchema);

export default CommentLike;
