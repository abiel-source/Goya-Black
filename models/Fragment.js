import { Schema, model, models } from "mongoose";

// ownerId denotes the generating user (unique user)

const FragmentSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    crystalId: {
      type: Schema.Types.ObjectId,
      ref: "Crystal",
    },

    name: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },

    location: {
      street: String,
      city: String,
      region: String,
      country: String,
      postalCode: String,
    },

    image: {
      url: String,
      width: Number,
      height: Number,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

FragmentSchema.index({ createdAt: -1, _id: -1 });

const Fragment = models.Fragment || model("Fragment", FragmentSchema);

export default Fragment;
