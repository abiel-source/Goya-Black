import { Schema, model, models } from "mongoose";

const MovementSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    period: {
      type: String,
    },
    description: {
      type: String,
    },
    originCountry: {
      type: String,
    },
    yearStart: {
      type: Number,
    },
    yearEnd: {
      type: Number,
    },
    regions: {
      type: [String],
      default: [],
    },
    keyArtists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Artist",
      },
    ],
    coverPainting: {
      type: Schema.Types.ObjectId,
      ref: "Painting",
    },
  },
  { timestamps: true }
);

MovementSchema.index({ slug: 1 });

const Movement = models.Movement || model("Movement", MovementSchema);
export default Movement;
