import express, { Router } from "express";
import { signInSchema } from "../schema/auth.js";
import { db } from "../index.js";

const router: Router = express.Router();

// create new user
router.post("/signup", (req, res) => {
  try {
    const { email, password, name } = signInSchema.parse(req.body);
    db.push({
      email,
      password,
      name,
    });
    console.log(db);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log("error in /signup: ", error);
    return;
  }
});

// log existing user in
router.post("/signin", (req, res) => {
  // skeleton
});

export default router;
