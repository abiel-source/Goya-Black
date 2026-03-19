import { Schema, model, models } from "mongoose";

const QuerySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    text: {
      type: String,
      required: true,
      index: true,
    },

    count: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// one record per user-query pair
QuerySchema.index({ userId: 1, text: 1 }, { unique: true });

// user history
QuerySchema.index({ userId: 1, createdAt: -1 });

// autocomplete lookup
QuerySchema.index({ text: 1 });

const Query = models.Query || model("Query", QuerySchema);
export default Query;
