import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../models/users.js";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

const SRCT_SIGN = process.env.SRCT_SIGN;

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  //Checking if the user already exists in the database or not
  const user = await userModel.findOne({ username });

  //if user exists
  if (user) {
    return res.status(400).json({ message: "user already exits" });
  }

  //else -> we hash the user password and save it in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  //Create new user
  const newUser = new userModel({ username, password: hashedPassword });
  await newUser.save();

  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  //Checking if the user already exists in the database or not
  const user = await userModel.findOne({ username });

  //if user doesn't exists
  if (!user) {
    return res.status(401).json({ message: "user doesn't exits" });
  }

  //Check the password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Username or password is wrong" });
  }

  //Create user token
  const token = jwt.sign({ id: user._id }, SRCT_SIGN);
  res.json({ token, userID: user._id, username });
});

export { router as userRouter };

// Middleware to authenticate the user

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, SRCT_SIGN, (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
