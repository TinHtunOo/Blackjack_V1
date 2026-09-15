import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import gameRouter from "../routes/gameRoutes.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const allowedOrigins = [
  "http://localhost:5173",
  "https://blackjack-v1999.vercel.app",
];
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

app.use((req, res, next) => {
  req.sessionId = req.headers["x-session-id"] || randomUUID();
  next();
});

app.get("/", (req, res) => {
  res.send("Blackjack API is running.");
});

app.use("/api/game", gameRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
