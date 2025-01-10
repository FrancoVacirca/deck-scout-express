import mtgpiruloService from "../services/mtgpiruloService.js";
import archidektService from "../services/archidektService.js";

class CardController {
  async searchCard(req, res) {
    try {
      const { name } = req.query;
      if (!name) {
        return res
          .status(400)
          .send("Card name is required as a query parameter");
      }
      const cards = await mtgpiruloService.searchCard(name);
      res.json(cards);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching card data", message: error.message });
    }
  }

  async getDeckByUrl(req, res) {
    try {
      const { url } = req.query;
      if (!url) {
        return res
          .status(400)
          .send("Archidekt URL is required as a query parameter");
      }
      const deckId = archidektService.extractDeckId(url);
      const cards = await archidektService.getDeckById(deckId);
      res.json(cards);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching deck data", message: error.message });
    }
  }

  async getDeckCardsAvailability(req, res) {
    try {
      const { url } = req.query;
      if (!url) {
        return res
          .status(400)
          .send("Archidekt URL is required as a query parameter");
      }

      const deckId = archidektService.extractDeckId(url);
      const deckCards = await archidektService.getDeckById(deckId);

      const availableCards = await Promise.all(
        deckCards.map(async (card) => {
          const piruloCards = await mtgpiruloService.searchCard(card.name);
          return {
            name: card.name,
            availableVersions: piruloCards,
          };
        })
      );

      res.json(availableCards);
    } catch (error) {
      res.status(500).json({
        error: "Error fetching deck availability",
        message: error.message,
      });
    }
  }
}

export default new CardController();
