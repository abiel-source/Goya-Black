import { Schema, model, models } from "mongoose";

const ThreadSchema = new Schema(
  {
    paintingId: {
      type: Schema.Types.ObjectId,
      ref: "Painting",
      required: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    preview: { type: String, default: "" },
    replyCount: { type: Number, default: 0 },
    lastCommentAt: { type: Date, default: null },
    lastCommentPreview: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ThreadSchema.index({ paintingId: 1, lastCommentAt: -1 });

const Thread = models.Thread || model("Thread", ThreadSchema);
export default Thread;
