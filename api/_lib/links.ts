import { query as q } from "faunadb";
import { client } from "./db";

export type Link = {
  counter: number;
  createdAt: string;
  key: string;
  url: string;
};

const linkByKey = (key: string) => q.Match(q.Index("link_by_key"), key);

type GetLink = (key: string) => Promise<Link>;
export const getLink: GetLink = key =>
  client.query(q.Select("data", q.Get(linkByKey(key))));

type IncrementLinkCount = (key: string) => Promise<void>;
export const incrementLinkCount: IncrementLinkCount = key =>
  client.query(
    q.Let(
      { item: q.Get(linkByKey(key)) },
      q.Update(q.Select("ref", q.Var("item")), {
        data: {
          counter: q.Add(1, q.Select(["data", "counter"], q.Var("item")))
        }
      })
    )
  );

type AddOrUpdateLink = (key: string, url: string) => Promise<Link>;
export const addOrUpdateLink: AddOrUpdateLink = async (key, url) => {
  const { data } = await client.query(
    q.Let(
      { item: linkByKey(key) },
      q.If(
        q.IsNonEmpty(q.Var("item")),
        q.Update(q.Select("ref", q.Get(q.Var("item"))), { data: { url } }),
        q.Create(q.Collection("links"), {
          data: { key, url, counter: 0, createdAt: q.ToString(q.Time("now")) }
        })
      )
    )
  );

  return data;
};
