import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

const getUser = (token) => {
  if (token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  }

  return new GraphQLError("Session expired", {
    extensions: {
      code: "UNAUTHENTICATED",
      http: { status: 401 },
    },
  });
};

export default getUser;
