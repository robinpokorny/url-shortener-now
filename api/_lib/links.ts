import { query } from "faunadb";
import { client } from "./db";

const { Collection, Create, Get, Match, Index, Update } = query;

type Ref = Object;

export type Link = {
  counter: number;
  createdAt: string;
  key: string;
  url: string;
};

const getISODateTime = () => new Date().toISOString();

type GetEmptyLink = () => Link;
const getEmptyLink: GetEmptyLink = () => ({
  counter: 0,
  createdAt: getISODateTime(),
  key: "",
  url: ""
});

type GetLink = (key: string) => Promise<{ data: Link; ref: Ref }>;
export const getLink: GetLink = key =>
  client.query(Get(Match(Index("ref_by_key"), key))) as any;

type IncrementLinkCount = (ref: Ref, counter: number) => Promise<void>;
export const incrementLinkCount: IncrementLinkCount = (ref, counter) =>
  client.query(Update(ref, { data: { counter: counter + 1 } }));

type CreateLink = (input: { key: string; url: string }) => Promise<Link>;
export const createLink: CreateLink = async input => {
  const { data } = await client.query(
    Create(Collection("links"), { data: { ...getEmptyLink(), ...input } })
  );

  return data;
};
