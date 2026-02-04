import { Pool } from "pg";

export const db  = new Pool({
   connectionString: process.env.DATABASE_URL,
   ssl: {
      rejectUnauthorized: false,
   }
});

db.on("connect", () => console.log("db connected!"));

db.on("error", (error) => {
   console.log(error);
   process.exit(1);
})