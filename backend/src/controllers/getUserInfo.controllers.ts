import { Request, Response } from "express";
import { db } from "../db/db";

export default async function getUserInfo(req: Request, res: Response) {
   try {
      
      const username = (req as any).user?.username;
      if(!username) {
         return res.status(401).json({
            message: "Unauthorized"
         });
      }
      
      const result = await db.query(
         `SELECT username, balance
          FROM users 
          WHERE username = $1`,
          [username]
      );

      if (result.rows.length === 0) {
         return res.status(404).json({ message: "User not found" });
      }

      return res.json(result.rows[0]);
   } catch(err) {
      return res.status(500).json({ message: "Server error" });
   }
}