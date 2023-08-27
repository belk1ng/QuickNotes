import { GraphQLError } from "graphql";
import errors from "../errors.js";
import jwt from "jsonwebtoken";

const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch {
      return new GraphQLError("Session expired", errors.UNAUTHENTICATED);
    }
  }
};

export default getUser;
