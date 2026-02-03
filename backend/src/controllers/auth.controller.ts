import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import createToken from "../utils/jwt";
import {db} from "../db/db";

export async function login(req: Request, res: Response, next: NextFunction) {
   try {
      const { username, password } = req.body;

      if (!username || !password) {
         return res.status(400).json({
            message: "username and password required",
         });
      }

      const userData = await db.query("SELECT * FROM users WHERE username = $1", [
         username,
      ]);

      if (userData.rows.length === 0) {
         return res.status(400).json({
            message: "Invalid username or Password",
         });
      }

      const dbPassword = userData.rows[0].password;
      const isPasswordCorrect = await bcrypt.compare(password, dbPassword);
      if (!isPasswordCorrect) {
         return res.status(400).json({
            message: "Invalid username or password",
         });
      }

      const jwtToken = createToken(username);
      res.cookie("jwtToken", jwtToken, {
         httpOnly: true,
         maxAge: 1000 * 60 * 60
      });
      return res.status(200).json({
         "message": "successfully logged in"
      });
   
   } catch(err) {
      return res.status(500).json({
         "message": "Internal Server Error"
      });
   }
}

export async function signUp(req: Request, res: Response) {
   try {
      const {username, password} = req.body;
      if(!username || !password) {
         return res.status(400).json({
            message: "username and password Required"
         });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const insertUserData = await db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *", [username, hashPassword]);

      if(insertUserData.rows.length === 0) {
         throw new Error("Database Internal server error");
      }

      const jwtToken = createToken(username);
      res.cookie("jwtToken", jwtToken, {
         httpOnly: true,
         maxAge: 1000 * 60 * 60,
      });

      return res.status(200).json({
         message: "Account Sucessfully Created"
      });
   } catch(err: any) {
      if (err.code === "23505") {
         return res.status(409).json({
            message: "username must be unique"
         });
      }

      return res.status(500).json({
         "message": "Internal Server Error"
      });
   }
}