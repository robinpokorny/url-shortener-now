import { NowRequest, NowResponse } from "@now/node";
import auth from "./_lib/auth";
import { addOrUpdateLink } from "./_lib/links";

export default async (req: NowRequest, res: NowResponse) => {
  if (!(await auth(req, res))) return;

  const { body } = req;
  const { url, key } = body;

  if (!url || !key) {
    res.status(400).json({ message: "Bad Request: provide a key and a url" });

    return;
  }

  const link = await addOrUpdateLink(key, url);

  res.json(link);
};
