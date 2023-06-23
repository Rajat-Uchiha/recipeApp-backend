//! Entry point of the backend

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";
import dotenv from "dotenv";

const app = express();

//? Middlewares
app.use(express.json()); //?Convert every single request data made in the frontend in the form of a json.

app.use(cors());

dotenv.config();
const CONNECTION_STR = process.env.CONNECTION_STR;
//ROUTES
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);
mongoose.connect(CONNECTION_STR);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server started at ", PORT);
});
