import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import typeDefs from "./schema.js";
import resolvers from "./resolvers/index.js";
import 'dotenv/config'
import DatabaseClient from "./database.js"
import { Note } from "./models/index.js";

const models = { Note }

DatabaseClient.connect();

const server = new ApolloServer({ typeDefs, resolvers });

const port = process.env.PORT ?? 4000;

startStandaloneServer(server, {
  listen: { port },
  context: async () => ({ models })
});

console.log(`🚀 GraphQL Server ready at localhost:${port}`);
