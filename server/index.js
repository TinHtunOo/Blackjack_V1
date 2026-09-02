// server/index.js
import express from "express";
// import morgan from "morgan";
import cors from "cors";
// import { Game } from "../game-engine/Game.js";
import gameRouter from "../routes/gameRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
// app.use(morgan("dev"));
// single global game instance for now — no sessions yet
// const game = new Game();

app.get("/", (req, res) => {
  res.send("Blackjack API is running.");
});

app.use("/api/game", gameRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
