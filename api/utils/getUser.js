import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET_KEY);
    }
  } catch {
    return new GraphQLError("Session expired", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
};

export default getUser;
