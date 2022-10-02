// import { Request, Response } from "express";
// import { User } from "../../interfaces/user";

import { SignJWT } from "jose";
import {
  GET_JWT_SECRET_KEY,
  JWT_EXPIRES_IN,
  JWT_ISSUER,
} from "../../constants";
import { User } from "../../interfaces/user";

// async function checkJWT(request: Request) {
//   //handles checking for expiry
//   if (!req.headers.cookie) {
//     return false;
//   }
//   let cookies = req.headers.cookie
//     .split("; ")
//     // .filter((x) => x.startsWith("JWT="));
//   if (cookies.length != 1) {
//     return false;
//   }
//   let jwt_received = cookies[0].split("=")[1];
//   try {
//     const { payload, protectedHeader } = await jwtVerify(
//       jwt_received,
//       publicKey,
//       { issuer: "user-service" }
//     );
//     return payload;
//   } catch (err) {
//     console.log("invalid jwt");
//     return false;
//   }
// }

export const signJWT = async (user: User) => {
  console.debug("Signing JWT for user: " + user);
  const jwt = await new SignJWT({
    user: user.id,
    username: user.username,
    password: user.password,
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(await GET_JWT_SECRET_KEY());
  console.debug("Signed JWT: " + jwt);
  return jwt;
};
