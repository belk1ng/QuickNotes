export default `#graphql
  scalar DateTime

  type Note {
    id: ID!
    content: String!
    author: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    notes: [Note]
    note(id: ID): Note
  }

  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    removeNote(id: ID!): Boolean!
  }
`;
