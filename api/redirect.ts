import { NowRequest, NowResponse } from "@now/node";
import { getLink, incrementLinkCount } from "../lib/links";

export default async (req: NowRequest, res: NowResponse) => {
  const { query } = req;
  const { key } = query;

  if (!key || Array.isArray(key)) {
    res
      .status(400)
      .json({ message: "Bad Request: provide a key to translate" });

    return;
  }

  try {
    const { data, ref } = await getLink(key);

    const { url, counter } = data;

    res.writeHead(301, { Location: url });
    res.end();

    await incrementLinkCount(ref, counter);
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
