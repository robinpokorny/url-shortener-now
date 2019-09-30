import { NowRequest, NowResponse } from "@now/node";
import { compare } from "bcrypt";

const passwordHash = process.env.PASSWORD_HASH as string;

const onAuthFailed = (res: NowResponse) => {
  res
    .status(401)
    .json({ message: "Auth Failed: Provided password is not correct" });

  return false;
};

export default async (req: NowRequest, res: NowResponse) => {
  const { body = {} } = req;
  const { password } = body;

  if (!password) {
    return onAuthFailed(res);
  }

  const match = await compare(password, passwordHash);

  if (!match) {
    return onAuthFailed(res);
  }

  return true;
};
