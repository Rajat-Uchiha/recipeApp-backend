import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  //   THIS IS GOING TO BE AN ARRAY OF STRINGS AS INGREDIENTS CAN BE MULTIPLE.
  ingredients: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  cookingTime: {
    type: Number,
    required: true,
  },

  //CONNECTION BETWEEN TWO SCHEMAS
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

export const recipeModel = mongoose.model("recipes", recipeSchema);
