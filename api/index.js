import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import 'dotenv/config'

import DatabaseClient from "./database.js"
import { Note } from "./models/index.js";

const typeDefs = `#graphql
  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    notes: [Note]
    note(id: ID): Note
  }

  type Mutation {
    newNote(content: String!): Note!
  }
`;

const resolvers = {
  Query: {
    notes: async () => {
      const records = await Note.find();
      
      return records;
    },
  
    note: async (_, args) => {
      const note = await Note.findById(args.id);
    
      return note
    },
  },

  Mutation: {
    newNote: async (_, args) => {
      let newNoteValues = {
        content: args.content,
        author: "Adam Scott",
      };

      const note = await Note.create(newNoteValues);

      return note;
    },
  },
};

DatabaseClient.connect();

const server = new ApolloServer({ typeDefs, resolvers });

const port = process.env.PORT ?? 4000;

startStandaloneServer(server, {
  listen: { port },
});

console.log(`🚀 GraphQL Server ready at localhost:${port}`);
