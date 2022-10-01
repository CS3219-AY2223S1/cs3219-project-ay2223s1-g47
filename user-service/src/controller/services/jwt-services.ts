// import { Request, Response } from "express";
// import { User } from "../../interfaces/user";

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

// async function signJWT(user: User) {
//   const jwt = await new SignJWT({ username: user.username })
//     .setProtectedHeader({ alg: "RS256" })
//     .setIssuedAt()
//     .setIssuer("user-service")
//     .setExpirationTime("2h")
//     .sign(privateKey);
//   return jwt;
// }
