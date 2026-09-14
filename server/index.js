import express from "express";
import cors from "cors";
import gameRouter from "../routes/gameRoutes.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const allowedOrigins = [
  "http://localhost:5173",
  "https://blackjack-v1999.vercel.app/",
];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Blackjack API is running.");
});

app.use("/api/game", gameRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
