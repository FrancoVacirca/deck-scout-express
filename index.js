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
    // this variable is storing just the cards that include the query on their name on the array
    const filteredCards = data.filter((card) => card.includes(cardName));
    res.send(filteredCards);
  } catch (error) {
    console.error("Error fetching card data:", error);
    res.status(500).send(`Error fetching card data: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
