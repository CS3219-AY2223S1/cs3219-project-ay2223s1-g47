import { Request } from "express";

import { jwtVerify, SignJWT } from "jose";
import { JWT_SECRET_KEY, JWT_EXPIRES_IN, JWT_ISSUER } from "../../constants";

/**
 * Decodes a JWT and returns the payload.
 */
export const checkJWT = async (request: Request) => {
  console.debug("Called checkJWT");
  // 1. check that the request has a JWT
  const jwtCookie = request.cookies.JWT;
  if (!jwtCookie) {
    return false; // missing cookie
  }

  // 2. check that the JWT is valid
  try {
    const { payload, protectedHeader } = await jwtVerify(
      jwtCookie,
      JWT_SECRET_KEY,
      { issuer: JWT_ISSUER, maxTokenAge: JWT_EXPIRES_IN }
    );
    return payload;
  } catch (err) {
    console.log("Invalid JWT");
    return false;
  }
};

/**
 * Converts a payload into a JWT and returns the token.
 */
export const signJWT = async (payload: any) => {
  console.debug("Signing JWT for payload: " + payload);
  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET_KEY);
  console.debug("Signed JWT: " + jwt);
  return jwt;
};
