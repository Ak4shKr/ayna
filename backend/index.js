import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { socket } from "./config/socket.js";
import mongoose from "mongoose";
config();
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(
  cors({
    origin: process.env.PROD_FRONTEND,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGOURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

const port = process.env.PORT || 3000;
const server = socket(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
