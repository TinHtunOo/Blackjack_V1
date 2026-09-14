import express from "express";
import cors from "cors";
import gameRouter from "../routes/gameRoutes.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3000;
console.log(PORT);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Blackjack API is running.");
});

app.use("/api/game", gameRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
