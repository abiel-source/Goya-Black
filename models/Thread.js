import { Schema, model, models } from "mongoose";

const ThreadSchema = new Schema(
  {
    fragmentId: {
      type: Schema.Types.ObjectId,
      ref: "Fragment",
      required: true,
      index: true,
    },

    // author of the TOP comment
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // preview of top-level comment
    preview: { type: String, default: "" },

    // replies only (not counting the top-level comment)
    replyCount: { type: Number, default: 0 },

    lastCommentAt: { type: Date, default: null },
    lastCommentPreview: { type: String, default: "" },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ThreadSchema.index({ fragmentId: 1, lastCommentAt: -1 });

const Thread = models.Thread || model("Thread", ThreadSchema);
export default Thread;
