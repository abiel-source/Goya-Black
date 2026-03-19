import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    threadId: {
      type: Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
      index: true,
    },

    fragmentId: {
      type: Schema.Types.ObjectId,
      ref: "Fragment",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    // likes on each comment (including top-level comment)
    likes: { type: Number, default: 0 },

    kind: {
      type: String,
      enum: ["top", "reply"],
      default: "reply",
    },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CommentSchema.index({ threadId: 1, createdAt: 1 });

const Comment = models.Comment || model("Comment", CommentSchema);
export default Comment;
