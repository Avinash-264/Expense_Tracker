import dotenv from "dotenv";
dotenv.config();

import express,{Request, Response} from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import authRoutes from "./routes/auth.routes";
import balanceRoutes from "./routes/balance.routes";

const app = express();
app.use(cookieParser());
app.use(cors())

app.get("/", (req: Request, res: Response) => {
   res.status(200).json({
      "message": "This is home Page"
   });
});

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/balance", balanceRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
