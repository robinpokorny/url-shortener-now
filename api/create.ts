import { NowRequest, NowResponse } from "@now/node";

export default async (req: NowRequest, res: NowResponse) => {
  const { body } = req;
  const { url, key, password } = body;

  if (password !== "test") {
    res.status(401).json({ url, key });
    return;
  }

  res.json({ url, key });
};
