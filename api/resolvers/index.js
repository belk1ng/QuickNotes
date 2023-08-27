import GraphQLIsoDate from "graphql-iso-date";
import Mutation from "./mutation.js";
import Query from "./query.js";

import Note from "./note.js";
import User from "./user.js";

const { GraphQLDateTime: DateTime } = GraphQLIsoDate;

export default {
  DateTime,
  Query,
  Mutation,
  Note,
  User,
};
