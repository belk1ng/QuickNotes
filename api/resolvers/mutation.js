import gravatar from "../utils/gravatar.js";
import { GraphQLError } from "graphql";
import errors from "../errors.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const trimAndLowerCase = (string) => string.toLowerCase().trim();

const checkUserIsSignedIn = (user, errorMessage) => {
  if (!user) {
    throw new Error(errorMessage);
  }
};

const prepareUserInfoForSignUp = async (userFormData) => {
  const { username, email, password } = userFormData;

  const formattedUsername = trimAndLowerCase(username);
  const formattedEmail = trimAndLowerCase(email);
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatar = gravatar(email);

  return {
    username: formattedUsername,
    email: formattedEmail,
    password: hashedPassword,
    avatar,
  };
};

const getUserByUsernameOrError = async (username, UserModel) => {
  const formattedUsername = trimAndLowerCase(username);

  const user = await UserModel.findOne({ username: formattedUsername });

  if (!user) {
    return new GraphQLError("Incorrect username", errors.UNAUTHENTICATED);
  }

  return user;
};

export default {
  signUp: async (_, userFormData, { models }) => {
    const preparedUserInfo = await prepareUserInfoForSignUp(userFormData);

    try {
      const user = await models.User.create(preparedUserInfo);

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return new GraphQLError(
        "Username and email must be unique",
        errors.UNAUTHENTICATED
      );
    }
  },

  signIn: async (_, { username, password }, { models }) => {
    const possibleUser = await getUserByUsernameOrError(username, models.User);

    const isPasswordCorrect = await bcrypt.compare(
      password,
      possibleUser?.password
    );

    if (isPasswordCorrect) {
      return jwt.sign({ id: possibleUser._id }, process.env.JWT_SECRET_KEY);
    }

    return new GraphQLError(
      "The password isn't correct",
      errors.UNAUTHENTICATED
    );
  },

  newNote: async (_, { content }, { models, user }) => {
    checkUserIsSignedIn(user, "You must be signed in to create a note");

    const author = new mongoose.Types.ObjectId(user.id);
    const newNoteValues = {
      content,
      author,
    };

    const note = await models.Note.create(newNoteValues);

    return note;
  },

  updateNote: async (_, { id, content }, { models, user }) => {
    checkUserIsSignedIn(user, "You must be signed in to update a note");

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
      checkUserIsSignedIn(user, "You must be signed in to remove the note");

      const note = await models.Note.findById(id);

      const userIsAuthor = note && note.author._id.toString() === user.id;

      if (userIsAuthor) {
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
    checkUserIsSignedIn(user, "You must be signed in to do this action");

    const note = await models.Note.findById(id);
    const noteHasRequestUser = note.inFavorite.indexOf(user.id) >= 0;

    let updatedNote;

    if (noteHasRequestUser) {
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
