import mtgpiruloService from "../services/mtgpiruloService.js";
import dealersService from "../services/dealersService.js";
import tolariaService from "../services/tolariaService.js";
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

      const [piruloCards, dealersCards, tolariaCards] = await Promise.all([
        mtgpiruloService.searchCard(name),
        dealersService.searchCard(name),
        tolariaService.searchCard(name),
      ]);

      res.json({
        name,
        results: [...piruloCards, ...dealersCards, ...tolariaCards],
      });
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
          const [piruloCards, dealersCards, tolariaCards] = await Promise.all([
            mtgpiruloService.searchCard(card.name),
            dealersService.searchCard(card.name),
            tolariaService.searchCard(card.name),
          ]);

          return {
            name: card.name,
            quantity: card.quantity,
            availability: {
              pirulo: piruloCards,
              dealers: dealersCards,
              tolaria: tolariaCards,
            },
          };
        })
      );

      res.json(availableCards);
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Error fetching deck availability",
          message: error.message,
        });
    }
  }
}

export default new CardController();
