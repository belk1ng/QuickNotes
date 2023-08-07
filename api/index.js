import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const port = process.env.PORT ?? 4000;

// Temp notes
let notes = [
  {
    id: "1",
    content: "This is a note",
    author: "Adam Scott",
  },
  {
    id: "2",
    content: "This is another note",
    author: "Harlow Everly",
  },
  {
    id: "3",
    content: "Oh hey look, another note!",
    author: "Riley Harrison",
  },
];

const typeDefs = `#graphql
  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    notes: [Note!]!
    note(id: ID): Note
  }

  type Mutation {
    newNote(content: String!): Note!
  }
`;

const resolvers = {
  Query: {
    notes: () => notes,
    note: (_, args) => {
      return notes.find((note) => note.id === args.id);
    },
  },

  Mutation: {
    newNote: (_, args) => {
      let noteValue = {
        id: String(notes.length + 1),
        content: args.content,
        author: "Adam Scott",
      };

      notes.push(noteValue);

      return noteValue;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port },
});

console.log(`🚀 GraphQL Server ready at localhost:${port}`);
