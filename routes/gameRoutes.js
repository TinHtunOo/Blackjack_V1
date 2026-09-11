import express from "express";
import * as gameController from "../controllers/gameController.js";

const router = express.Router();

router.post("/deal", gameController.deal);
router.post("/hit", gameController.hit);
router.post("/stand", gameController.stand);
router.post("/double-down", gameController.doubleDown);
router.post("/split", gameController.split);
router.get("/result", gameController.result);
router.get("/chips", gameController.getChips);
router.post("/restart-chips", gameController.restartChips);

export default router;
