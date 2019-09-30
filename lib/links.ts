import { query } from "faunadb";
import { client } from "../lib/db";

const { Get, Match, Index, Update } = query;

type Ref = Object;

type Link = {
  counter: number;
  createdAt: string;
  key: string;
  url: string;
};

type GetLink = (key: string) => Promise<{ data: Link; ref: Ref }>;
export const getLink: GetLink = key =>
  client.query(Get(Match(Index("ref_by_key"), key))) as any;

type IncrementLinkCount = (ref: Ref, counter: number) => Promise<void>;
export const incrementLinkCount: IncrementLinkCount = (ref, counter) =>
  client.query(Update(ref, { data: { counter: counter + 1 } }));
