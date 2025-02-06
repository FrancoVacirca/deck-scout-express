import fetch from "node-fetch";
import config from "../config/config.js";

class MTGPiruloService {
  async searchCard(cardName) {
    const autocompleteData = await this.getAutocomplete(cardName);
    const filteredCards = autocompleteData.filter((card) =>
      card.includes(cardName)
    );
    const cardData = await this.getCardDetails(cardName, filteredCards);
    return cardData;
  }

  async getAutocomplete(cardName) {
    const url = `${
      config.mtgpiruloBaseUrl
    }/search/autocomplete?term=${encodeURIComponent(cardName)}`;
    const response = await fetch(url);
    return response.json();
  }

  async getCardDetails(cardName, filteredCards) {
    const url = `${
      config.mtgpiruloBaseUrl
    }/products/search?q=${encodeURIComponent(cardName)}`;
    const response = await fetch(url);
    const body = await response.text();
    return this.parseCardDetails(body, filteredCards);
  }

  parseCardDetails(body, filteredCards) {
    const formRegex =
      /<form class="add-to-cart-form" data-vid="(\d+)" data-name="(.+?)" data-id="(\d+)" data-price="(.+?)" data-category="(.+?)" data-variant="(.+?)"/g;
    const availableCardUrlRegex =
      /<a href="\/catalog\/(.+?)\/(.+?)\/(\d+)" itemprop="url">/g;
    const imageRegex = /<img src="(.+?)" alt="(.+?)" itemprop="image"/g;
    const matches = [...body.matchAll(formRegex)];
    const availableMatches = [...body.matchAll(availableCardUrlRegex)];
    const imageMatches = [...body.matchAll(imageRegex)];
    const unavailableCategory = "Juegos de Tablero";
    const cards = [];

    for (const match of matches) {
      if (
        filteredCards.includes(match[2]) &&
        !cards.find(
          (card) => card.name === match[2] && card.variant === match[6]
        )
      ) {
        if (match[5] !== unavailableCategory) {
          cards.push({
            store: "Pirulo",
            name: match[2],
            id: match[3],
            price: match[4],
            category: match[5],
            variant: match[6],
          });
        }
      }
    }

    for (const match of availableMatches) {
      const matchingCards = cards.filter((card) => card.id === match[3]);
      if (matchingCards.length > 0) {
        const cardUrl = `${config.mtgpiruloBaseUrl}/catalog/${match[1]}/${match[2]}/${match[3]}`;
        matchingCards.forEach((card) => {
          card.url = cardUrl;
        });
      }
    }

    for (const match of imageMatches) {
      const matchingCards = cards.filter((card) => card.name === match[2]);
      if (matchingCards.length > 0) {
        matchingCards.forEach((card) => {
          card.image = match[1];
        });
      }
    }

    return cards;
  }
}

export default new MTGPiruloService();
