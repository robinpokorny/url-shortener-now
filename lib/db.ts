import { Client, query } from "faunadb";

const { Get, Match, Index, Update } = query;

const secret = process.env.FAUNADB_SECRET_KEY as string;

export const client = new Client({ secret });
