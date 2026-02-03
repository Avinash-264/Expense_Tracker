import jwt from "jsonwebtoken";

export default function createToken(username: string) {
   const JWT_SECRET_VALUE: string | undefined = process.env.JWT_SECRET_VALUE;

   if (!JWT_SECRET_VALUE) {
      throw new Error("JWT secret missing");
   }

   const jwtToken = jwt.sign({
      username: username
   }, JWT_SECRET_VALUE, { expiresIn: "1h"} )

   return jwtToken;
}