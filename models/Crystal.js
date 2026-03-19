import { Schema, model, models } from "mongoose";

// ownerId denotes the generating user (unique user)

const CrystalSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    // images
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "Fragment",
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Crystal = models.Crystal || model("Crystal", CrystalSchema);

export default Crystal;
