import express, { Router } from "express";
import { signUpSchema, singInSchema } from "../schema/auth.js";
import { USERS } from "../store/user.js";

const router: Router = express.Router();

// create new user
router.post("/signup", (req, res) => {
  try {
    const { email, password, name } = signUpSchema.parse(req.body);

    if (USERS[email]) {
      return res
        .status(400)
        .json({ message: "user already exists with given email" });
    }

    USERS[email] = {
      email,
      password,
      name,
      balance: { usd_balance: 5000 },
      assets: {},
    };

    return res.status(200).json({ message: "user created successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// log existing user in
router.post("/signin", (req, res) => {
  try {
    const { email, password } = singInSchema.parse(req.body);

    if (!USERS[email]) {
      return res.status(400).json({ message: "Invalid user" });
    }
    const user = USERS[email];
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    return res.status(200).json(user);
  } catch (error) {}
});

export default router;
