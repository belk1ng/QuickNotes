import mongoose from "mongoose";

const { Schema, model } = mongoose;

const noteSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Note = model("Note", noteSchema);

export default Note;
