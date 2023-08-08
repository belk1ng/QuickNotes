import GraphQLIsoDate from "graphql-iso-date";
import Mutation from "./mutation.js";
import Query from "./query.js";

const { GraphQLDateTime: DateTime } = GraphQLIsoDate;

export default {
  DateTime,
  Query,
  Mutation,
};
