const express = require("express");
const app = express();
const port = 3000;

app.get("/search", async (req, res) => {
  const cardName = req.query.name;

  if (!cardName) {
    return res.status(400).send("Card name is required as a query parameter");
  }

  try {
    const url = `https://www.mtgpirulo.com/search/autocomplete?term=${encodeURIComponent(
      cardName
    )}`;
    const response = await fetch(url);
    const data = await response.json();
    const filteredCards = data.filter((card) => card.includes(cardName));

    const queryUrl = `https://www.mtgpirulo.com/products/search?q=${encodeURIComponent(
      cardName
    )}`;
    const queryResponse = async () => {
      const response = await fetch(queryUrl);
      // search for `<form>` tag in the response, for example: `<form class="add-to-cart-form" data-vid="27310150" data-name="Chatterfang, Squirrel General - Borderless" data-id="1530469" data-price="$15.99" data-category="Modern Horizons 2" data-variant="NM-Mint, English"`
      const formRegex =
        /<form class="add-to-cart-form" data-vid="(\d+)" data-name="(.+?)" data-id="(\d+)" data-price="(.+?)" data-category="(.+?)" data-variant="(.+?)"/g;
      const body = await response.text();
      const matches = body.matchAll(formRegex);
      // data-name has to match with filteredCards
      if (matches) {
        const cards = [];
        for (const match of matches) {
          if (filteredCards.includes(match[2])) {
            // stored cards cannot get repeated, just one time stored if the name doesn't exist
            if (!cards.find((card) => card.name === match[2])) {
              cards.push({
                name: match[2],
                id: match[3],
                price: match[4],
                category: match[5],
                variant: match[6],
              });
            }
          }
        }
        return cards;
      }
    };

    const cards = await queryResponse();
    res.send(cards);
  } catch (error) {
    console.error("Error fetching card data:", error);
    res.status(500).send(`Error fetching card data: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
