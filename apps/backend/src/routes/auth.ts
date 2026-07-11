import express, { Router } from "express";
import { logInSchema, signInSchema } from "../types.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router: Router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { success } = signInSchema.safeParse(req.body);
    if (!success) {
      return res.status(401).json({ message: "Invalid input parameters" });
    }

    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const userId = user.userId;

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({
        message: "internal error jwt",
      });
    }

    const token = jwt.sign({ email, userId }, JWT_SECRET);

    return res.status(201).json({
      message: "success",
      data: {
        userId,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { success } = logInSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: "Invalid inputs" });
    }
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "user not found, try signing in" });
    }

    const hashedPassword = user?.password;

    const pass = await bcrypt.compare(password, hashedPassword);
    if (!pass) {
      return res.status(400).json({ message: "wrong password" });
    }

    const userId = user.userId;

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.log("undefined jwt secret");
      return res.status(500).json({ message: "Internel error jwt" });
    }

    const token = jwt.sign({ email, userId }, JWT_SECRET);

    return res.status(200).json({
      message: "success",
      data: {
        userId,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
