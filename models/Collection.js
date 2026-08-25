import { Schema, model, models } from "mongoose";

const CollectionSchema = new Schema(
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

CollectionSchema.index({ ownerId: 1, createdAt: -1 });

const Collection = models.Collection || model("Collection", CollectionSchema);
export default Collection;
