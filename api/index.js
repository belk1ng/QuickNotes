import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from "@apollo/server";
import resolvers from "./resolvers/index.js";
import typeDefs from "./schema.js";
import "dotenv/config";

import { createServer } from "http";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import DatabaseClient from "./database.js";
import { Note, User } from "./models/index.js";
import getUser from "./utils/getUser.js";

const models = { Note, User };

const app = express();
const httpServer = createServer(app);

app.use(cors, helmet);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

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
