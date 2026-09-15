import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  if (!req.cookies.sessionId) {
    const sessionId = randomUUID();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    req.sessionId = sessionId;
  } else {
    req.sessionId = req.cookies.sessionId;
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Blackjack API is running.");
});

app.use("/api/game", gameRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
