import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    image: {
      type: String,
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    starredArtists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Artist",
        default: [],
      },
    ],
    saved: {
      paintings: [
        {
          type: Schema.Types.ObjectId,
          ref: "Painting",
          default: [],
        },
      ],
      collections: [
        {
          type: Schema.Types.ObjectId,
          ref: "Collection",
          default: [],
        },
      ],
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
