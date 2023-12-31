export default `#graphql
  scalar DateTime

  type Note {
    id: ID!
    content: String!
    author: User!
    favoriteCount: Int!
    inFavorite: [User!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    notes: [Note!]!
    favoriteNotes: [Note!]!
  }

  type Query {
    notes: [Note!]
    note(id: ID): Note

    user(username: String!): User
    users: [User!]!
    me: User
  }

  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    removeNote(id: ID!): Boolean!
    toggleFavorite(id: ID!): Note!

    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String!, password: String!): String!
  }
`;
