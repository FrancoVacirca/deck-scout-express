import app from "./src/app.js";
import config from "./src/config/config.js";

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
  console.log("Available endpoints:");
  console.log("GET /api/deck-url?url=<deck-url>");
  console.log("GET /api/search?name=<card-name>");
  console.log("GET /api/deck-availability?url=<deck-url>");
});
