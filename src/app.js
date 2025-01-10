import express from "express";
import cardRoutes from "./routes/cardRoutes.js";

const app = express();

app.use("/api", cardRoutes);

export default app;
