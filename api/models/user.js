import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notes",
      },
    ],
    favoriteNotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notes",
      },
    ],
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
