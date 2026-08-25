import { Schema, model, models } from "mongoose";

const SubmissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["artist", "painting", "collection"],
      required: true,
    },
    referenceUrl: {
      type: String,
    },
    artistName: {
      type: String,
    },
    paintingTitle: {
      type: String,
    },
    note: {
      type: String,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

SubmissionSchema.index({ status: 1, createdAt: -1 });

const Submission = models.Submission || model("Submission", SubmissionSchema);
export default Submission;
