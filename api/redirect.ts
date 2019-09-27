import { NowRequest, NowResponse } from "@now/node";
import { query } from "faunadb";
import { client } from "../lib/db";

const { Get, Match, Index, Update } = query;

export default async (req: NowRequest, res: NowResponse) => {
  const { query } = req;
  const { key } = query;

  if (!key) {
    res
      .status(400)
      .json({ message: "Bad Request: provide a key to translate" });

    return;
  }

  try {
    const { data, ref } = (await client.query(
      Get(Match(Index("ref_by_key"), key))
    )) as any;

    const { url, counter } = data;

    res.writeHead(301, { Location: url });
    res.end();

    await client.query(Update(ref, { data: { counter: counter + 1 } }));
  } catch (error) {
    if (error.name === "NotFound") {
      res
        .status(404)
        .json({ message: `Not Found: no redirection for \`${key}\`` });

      return;
    }

    console.error({ error });

    res.status(500).json({ stack: error.stack, message: error.message });
    return;
  }
};
