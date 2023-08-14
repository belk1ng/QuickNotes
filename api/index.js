import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import typeDefs from "./schema.js";
import resolvers from "./resolvers/index.js";
import "dotenv/config";
import DatabaseClient from "./database.js";
import { Note, User } from "./models/index.js";
import getUser from "./utils/getUser.js";

const models = { Note, User };

const server = new ApolloServer({ typeDefs, resolvers });

const port = process.env.PORT ?? 4000;

DatabaseClient.connect();

startStandaloneServer(server, {
  listen: { port },
  context: async ({ req }) => {
    const jwtToken = req.headers.authorization ?? "";

    const user = getUser(jwtToken);

    return { models, user };
  },
});

console.log(`🚀 GraphQL Server ready at localhost:${port}`);
