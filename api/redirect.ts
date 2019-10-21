import { NowRequest, NowResponse } from "@now/node";
import { getLink, incrementLinkCount } from "./_lib/links";

export default async (req: NowRequest, res: NowResponse) => {
  console.log(req.query);
  const { query } = req;
  const { key } = query;

  if (!key || Array.isArray(key)) {
    res
      .status(400)
      .json({ message: "Bad Request: provide a key to translate" });

    return;
  }

  try {
    const { url } = await getLink(key);

    res.writeHead(301, { Location: url });

    await incrementLinkCount(key);
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
  } finally {
    res.end();
  }
};
