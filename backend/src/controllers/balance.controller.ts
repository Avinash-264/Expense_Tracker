import { Request, Response } from "express";
import { db } from "../db/db";

export async function addBalance(req: Request, res: Response) {
   try { 
      const username = (req as any).user?.username;
      const money = Number(req.body.money);
      
      if(isNaN(money) || money <= 0) {
         return res.status(400).json({
            message: "Enter valid number"
         });
      }
      
      if(!username) {
         return res.status(401).json({
            message: "Unauthorized Access"
         });
      }

      const updateData = await db.query("UPDATE users SET balance = balance + $1 WHERE username = $2 RETURNING *", [money, username]);

      if(updateData.rows.length === 0) {   
         return res.status(404).json({
            message: "User not found"
         });
      }

      const updatedBalance = Number(updateData.rows[0].balance);

      return res.status(200).json({
         message: `updated balance ${updatedBalance}`
      });

   } catch(err) {
      return res.status(500).json({
         message: "Internal Server Errror"
      });
   }
}

export async function debitBalance(req: Request, res: Response) {
   try {
      const username = (req as any).user?.username;

      if (!username) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const money = Number(req.body.money);

      if (isNaN(money) || money <= 0) {
         return res.status(400).json({ message: "Invalid amount" });
      }

      const result = await db.query(
         `UPDATE users
         SET balance = balance - $1
         WHERE username = $2
         AND balance >= $1
         RETURNING balance`,
         [money, username]
      );

      if (result.rows.length === 0) {
         return res.status(400).json({
         message: "Insufficient balance"
         });
      }

      return res.json({
         balance: result.rows[0].balance
      });

   } catch (err) {
      console.error(err);

      return res.status(500).json({
         message: "Server error"
      });
   }
}
