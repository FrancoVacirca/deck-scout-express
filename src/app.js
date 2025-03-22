import express from "express";
import cardRoutes from "./routes/cardRoutes.js";
import cors from "cors";

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use("/api", cardRoutes);

export default app;
