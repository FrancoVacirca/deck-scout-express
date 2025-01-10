import express from "express";
import cardController from "../controllers/cardController.js";

const router = express.Router();

router.get("/search", cardController.searchCard);
router.get("/deck-url", cardController.getDeckByUrl);
router.get("/deck-availability", cardController.getDeckCardsAvailability);

export default router;
