import express from "express";
import { recipeModel } from "../models/recipes.js";
import { userModel } from "../models/users.js";
import { verifyToken } from "./users.js";
const router = express.Router();

//Homepage which is going to show all the recipes stored in the database
router.get("/", async (req, res) => {
  try {
    //Get all the recipes in the response using find by passing an empty object.
    const response = await recipeModel.find({});
    res.json(response);
  } catch (error) {
    console.error(error);
  }
});

// Route To create a new recipe
router.post("/", verifyToken, async (req, res) => {
  const recipe = new recipeModel(req.body);

  try {
    const response = await recipe.save();
    res.json(response);
  } catch (err) {
    console.error(err);
  }
});

//To save a recipe
router.put("/", verifyToken, async (req, res) => {
  try {
    //find the recipe first which is clicked by the user in the collection at the backend
    const recipe = await recipeModel.findById(req.body.recipeId);

    //find the user who clicked the saved recipe button
    const user = await userModel.findById(req.body.userID);

    //Add the clicked recipe in saved recipe array of that particular user.
    user.savedRecipes.push(recipe);

    //save the changes.
    await user.save();

    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(err);
  }
});

//This route is going to get all the ids of the recipes saved in the saved recipes of that particular user
router.get("/savedrecipes/ids/:userID", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.error(err);
  }
});

//Get all the saved recipes(real recipes)
router.get("/savedrecipes/:userID", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userID);
    const savedRecipes = await recipeModel.find({
      _id: { $in: user.savedRecipes },
    });

    res.json(savedRecipes);
  } catch (error) {
    console.error(error);
  }
});

export { router as recipesRouter };
