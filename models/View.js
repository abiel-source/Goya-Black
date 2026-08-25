import { Schema, model, models } from "mongoose";

const ViewSchema = new Schema(
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
    lastViewedAt: {
      type: Date,
      default: Date.now,
    },
    viewCount: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true }
);

ViewSchema.index({ userId: 1, paintingId: 1 }, { unique: true });

const View = models.View || model("View", ViewSchema);
export default View;
