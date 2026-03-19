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

    saved: {
      crystals: [
        {
          type: Schema.Types.ObjectId,
          ref: "Crystal",
          default: [],
        },
      ],
      fragments: [
        {
          type: Schema.Types.ObjectId,
          ref: "Fragment",
          default: [],
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;
