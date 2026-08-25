import { Schema, model, models } from "mongoose";

const GallerySchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    paintings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Painting",
      },
    ],
    coverPainting: {
      type: Schema.Types.ObjectId,
      ref: "Painting",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

GallerySchema.index({ ownerId: 1, createdAt: -1 });

const Gallery = models.Gallery || model("Gallery", GallerySchema);
export default Gallery;
