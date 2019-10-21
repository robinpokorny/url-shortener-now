import { NowRequest, NowResponse } from "@now/node";
import auth from "./_lib/auth";
import { createLink } from "./_lib/links";

export default async (req: NowRequest, res: NowResponse) => {
  console.log(req.body);
  if (!(await auth(req, res))) return;

  const { body } = req;
  const { url, key } = body;

  if (!url || !key) {
    res.status(400).json({ message: "Bad Request: provide a key and a url" });

    return;
  }

  const link = await createLink({ url, key });

  res.json(link);
};
