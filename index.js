const express = require("express");
const app = express();
const port = 3000;

// Endpoint to fetch cards data from Archidekt with a deck URL
app.get("/deck-scout", async (req, res) => {
  const archidektUrl = req.query.url;
  if (!archidektUrl) {
    return res
      .status(400)
      .send("Archidekt URL is required as a query parameter");
  }

  // Extract deck ID from URL
  const deckIdMatch = archidektUrl.match(/\/decks\/(\d+)/);
  if (!deckIdMatch) {
    return res.status(400).send("Invalid Archidekt URL format");
  }
  const deckId = deckIdMatch[1];

  try {
    // Use Archidekt's public API endpoint for specific decks
    const response = await fetch(
      `https://archidekt.com/api/decks/${deckId}/cards/`
    );

    if (!response.ok) {
      throw new Error(`Archidekt API returned status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error fetching deck data",
      message: error.message,
      details: `Failed to fetch deck ID: ${deckId}`,
    });
  }
});

// Endpoint to fetch decks by archidekt username
app.get("/user-decks", async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).send("Username is required as a query parameter");
  }

  try {
    const response = await fetch(
      `https://archidekt.com/api/decks/cards/?orderBy=-createdAt&owner=${username}&ownerexact=true&pageSize=50`
    );

    if (!response.ok) {
      throw new Error(`Archidekt API returned status: ${response.status}`);
    }

    const data = await response.json();
    const deckData = await data.results.map((deck) => {
      return {
        ownerId: deck.owner.id,
        username: deck.owner.username,
        deckName: deck.name,
        deckId: deck.id,
        deckImage: deck.featured,
      };
    });

    res.json(deckData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error fetching user decks",
      message: error.message,
      details: `Failed to fetch decks for user: ${username}`,
    });
  }
});

// Enpoint to fetch cards data from user-decks response
app.get("/deck-cards", async (req, res) => {
  const deckId = req.query.deckId;
  if (!deckId) {
    return res.status(400).send("Deck ID is required as a query parameter");
  }

  try {
    const response = await fetch(
      `https://archidekt.com/api/decks/${deckId}/cards/`
    );

    if (!response.ok) {
      throw new Error(`Archidekt API returned status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error fetching deck data",
      message: error.message,
      details: `Failed to fetch deck ID: ${deckId}`,
    });
  }
});

// Search
// app.get("/search", async (req, res) => {
//   const cardName = req.query.name;

//   if (!cardName) {
//     return res.status(400).send("Card name is required as a query parameter");
//   }

//   try {
//     const url = `https://www.mtgpirulo.com/search/autocomplete?term=${encodeURIComponent(
//       cardName
//     )}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     const filteredCards = data.filter((card) => card.includes(cardName));

//     const queryUrl = `https://www.mtgpirulo.com/products/search?q=${encodeURIComponent(
//       cardName
//     )}`;
//     const queryResponse = async () => {
//       const response = await fetch(queryUrl);
//       // search for `<form>` tag in the response, for example: `<form class="add-to-cart-form" data-vid="27310150" data-name="Chatterfang, Squirrel General - Borderless" data-id="1530469" data-price="$15.99" data-category="Modern Horizons 2" data-variant="NM-Mint, English"`
//       const formRegex =
//         /<form class="add-to-cart-form" data-vid="(\d+)" data-name="(.+?)" data-id="(\d+)" data-price="(.+?)" data-category="(.+?)" data-variant="(.+?)"/g;
//       const body = await response.text();
//       const matches = body.matchAll(formRegex);
//       // data-name has to match with filteredCards
//       if (matches) {
//         const cards = [];
//         for (const match of matches) {
//           if (filteredCards.includes(match[2])) {
//             // stored cards cannot get repeated, just one time stored if the name doesn't exist
//             if (!cards.find((card) => card.name === match[2])) {
//               cards.push({
//                 name: match[2],
//                 id: match[3],
//                 price: match[4],
//                 category: match[5],
//                 variant: match[6],
//               });
//             }
//           }
//         }
//         return cards;
//       }
//     };

//     const cards = await queryResponse();
//     res.send(cards);
//   } catch (error) {
//     console.error("Error fetching card data:", error);
//     res.status(500).send(`Error fetching card data: ${error.message}`);
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Available endpoints:");
  console.log("  GET /deck-scout?url=https://archidekt.com/decks/{deckId}/...");
  console.log("  GET /user-decks?username={username}");
});
