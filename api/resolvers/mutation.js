import gravatar from "../utils/gravatar.js";
import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// TODO: Refactor throwing errors

const trimAndLowerCase = (string) => string.toLowerCase().trim();

export default {
  // Auth
  signUp: async (_, { username, email, password }, { models }) => {
    const formattedUsername = trimAndLowerCase(username);
    const formattedEmail = trimAndLowerCase(email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = gravatar(email);

    try {
      const user = await models.User.create({
        username: formattedUsername,
        email: formattedEmail,
        password: hashedPassword,
        avatar,
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return new GraphQLError("Username and email must be unique", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }
  },

  signIn: async (_, { username, password }, { models }) => {
    const formattedUsername = trimAndLowerCase(username);

    const user = await models.User.findOne({ username: formattedUsername });

    if (!user) {
      return new GraphQLError("Incorrect username", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    } else {
      const compareResult = await bcrypt.compare(password, user.password);

      if (compareResult) {
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      }

      return new GraphQLError("The password isn't correct", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }
  },

  // Note
  newNote: async (_, { content }, { models, user }) => {
    if (!user) {
      throw new Error("You must be signed in to create a note");
    }

    const author = new mongoose.Types.ObjectId(user.id);
    const newNoteValues = {
      content,
      author,
    };

    const note = await models.Note.create(newNoteValues);

    return note;
  },

  updateNote: async (_, { id, content }, { models, user }) => {
    if (!user) {
      throw new Error("You must be signed in to create a note");
    }

    const note = await models.Note.findById(id);

    const userIsAuthor = note && note.author._id.toString() === user.id;

    if (userIsAuthor) {
      const updatedNote = models.Note.findOneAndUpdate(
        { _id: id },
        { $set: { content } },
        { returnDocument: "after" }
      );

      return updatedNote;
    }

    throw new Error("You don't have permissions to update the note");
  },

  removeNote: async (_, { id }, { models, user }) => {
    try {
      if (!user) {
        throw new Error("You must be signed in to create a note");
      }

      const note = await models.Note.findById(id);

      const userIsAuthorFlag = note && note.author._id.toString() === user.id;

      if (userIsAuthorFlag) {
        await note.deleteOne();
        return true;
      } else {
        throw new Error("You don't have permissions to delete the note");
      }
    } catch {
      return false;
    }
  },

  toggleFavorite: async (_, { id }, { models, user }) => {
    if (!user) {
      throw new Error("You must be signed in to do this action");
    }

    const note = await models.Note.findById(id);
    const noteHasUser = note.inFavorite.indexOf(user.id);

    let updatedNote;

    if (noteHasUser >= 0) {
      updatedNote = await models.Note.findByIdAndUpdate(
        note.id,
        {
          $pull: { inFavorite: new mongoose.Types.ObjectId(user.id) },
          $inc: { favoriteCount: -1 },
        },
        { new: true }
      );
    } else {
      updatedNote = await models.Note.findByIdAndUpdate(
        note.id,
        {
          $push: { inFavorite: new mongoose.Types.ObjectId(user.id) },
          $inc: { favoriteCount: 1 },
        },
        { new: true }
      );
    }

    return updatedNote;
  },
};
