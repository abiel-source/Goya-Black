import { Schema, model, models } from "mongoose";

const ConversationSchema = new Schema(
  {
    // assert only 2
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ],

    // deterministic key to enforce uniqueness
    pairKey: { type: String, unique: true, index: true },

    // cache front-end preview information
    lastMessageAt: { type: Date, default: null },
    lastMessagePreview: { type: String, default: "" },
    lastMessageSenderId: { type: Schema.Types.ObjectId, ref: "User" },

    // assert only 2
    // Read receipts - store timestamp last read per user
    // derive unread count as messages created gt lastReadAt
    readState: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        lastReadAt: { type: Date, default: null },
      },
    ],
  },
  { timestamps: true }
);

// Optional: helps lookup by participant quickly
ConversationSchema.index({ participants: 1, lastMessageAt: -1 });

const Conversation =
  models.Conversation || model("Conversation", ConversationSchema);

export default Conversation;
