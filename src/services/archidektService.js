import fetch from "node-fetch";
import config from "../config/config.js";

class ArchidektService {
  async getDeckById(deckId) {
    const response = await fetch(
      `${config.archidektBaseUrl}/decks/${deckId}/cards/`
    );
    if (!response.ok) {
      throw new Error(`Archidekt API returned status: ${response.status}`);
    }
    const data = await response.json();
    return data.map((card) => ({
      name: card.card.oracleCard.name,
      quantity: card.quantity,
    }));
  }

  extractDeckId(url) {
    const match = url.match(/\/decks\/(\d+)/);
    if (!match) throw new Error("Invalid Archidekt URL format");
    return match[1];
  }
}

export default new ArchidektService();
