import { Schema, model, models } from "mongoose";

const PaintingSchema = new Schema(
  {
    metObjectId: {
      type: Number,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    artistId: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      index: true,
    },
    movementId: {
      type: Schema.Types.ObjectId,
      ref: "Movement",
      index: true,
    },
    year: {
      type: String,
    },
    medium: {
      type: String,
    },
    dimensions: {
      type: String,
    },
    department: {
      type: String,
    },
    museum: {
      type: String,
      default: "The Metropolitan Museum of Art",
    },
    image: {
      url: String,
      width: Number,
      height: Number,
    },
    tags: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isHighlight: {
      type: Boolean,
      default: false,
    },
    isPublicDomain: {
      type: Boolean,
      default: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    sourceUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

PaintingSchema.index({ createdAt: -1, _id: -1 });
PaintingSchema.index({ title: "text", tags: "text" });

const Painting = models.Painting || model("Painting", PaintingSchema);
export default Painting;
