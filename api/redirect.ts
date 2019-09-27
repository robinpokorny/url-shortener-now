import { NowRequest, NowResponse } from "@now/node";
import { Client, query } from "faunadb";

const { Get, Match, Index } = query;

const secret = process.env.FAUNADB_SECRET_KEY as string;
const client = new Client({ secret });

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
    const { data } = (await client.query(
      Get(Match(Index("ref_by_key"), key))
    )) as any;

    const { url } = data;

    res.writeHead(301, { Location: url });
    res.end();
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
