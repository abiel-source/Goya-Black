import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    // reference the conversation this is under
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: { type: String, required: true },

    // optional for later
    type: { type: String, default: "text" },
  },
  { timestamps: true }
);

// Fast pagination per conversation
MessageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = models.Message || model("Message", MessageSchema);
export default Message;
