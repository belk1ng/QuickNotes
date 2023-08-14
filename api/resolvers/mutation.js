import gravatar from "../utils/gravatar.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";

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
  newNote: async (_, { content }, { models }) => {
    let newNoteValues = {
      content: content,
      author: "Adam Scott",
    };

    const note = await models.Note.create(newNoteValues);

    return note;
  },

  updateNote: async (_, { id, content }, { models }) => {
    const note = await models.Note.findByIdAndUpdate(
      id,
      { $set: { content } },
      { returnDocument: "after" }
    );

    return note;
  },

  removeNote: async (_, { id }, { models }) => {
    try {
      await models.Note.findByIdAndRemove(id);

      return true;
    } catch {
      return false;
    }
  },
};
