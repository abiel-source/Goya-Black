import { Schema, model, models } from "mongoose";

const ArtistSchema = new Schema(
  {
    metArtistId: {
      type: String,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    bio: {
      type: String,
    },
    nationality: {
      type: String,
    },
    birthYear: {
      type: Number,
    },
    deathYear: {
      type: Number,
    },
    movement: {
      type: Schema.Types.ObjectId,
      ref: "Movement",
    },
    notableWorks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Painting",
      },
    ],
    portraitImage: {
      url: String,
      width: Number,
      height: Number,
    },
    starCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ArtistSchema.index({ slug: 1 });
ArtistSchema.index({ name: "text" });

const Artist = models.Artist || model("Artist", ArtistSchema);
export default Artist;
