import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
   try {
      const jwtToken = req.cookies.jwtToken;
      if(!jwtToken) {
         return res.status(401).json({
            message: "Unauthorized"
         });
      }

      const secret = process.env.JWT_SECRET_VALUE;
      if(!secret) {
         return res.status(500).json({
            message: "Jwt Configuration issue"
         });
      }

      const jwtData = jwt.verify(jwtToken, secret);
      (req as any).user = jwtData;
      next();

   } catch(err) {
      return res.status(401).json({
         message: "Invalid or expired token"
      });
   }
   
   
}