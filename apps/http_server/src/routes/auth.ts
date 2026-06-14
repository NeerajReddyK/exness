import express, { Router } from "express";
import { signUpSchema, singInSchema } from "../schema/authSchema.js";
import { prisma } from "../store/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const router: Router = express.Router();

// create new user
router.post("/signup", async (req, res) => {
  try {
    const { success } = signUpSchema.safeParse(req.body);
    if (!success) {
      res.status(401).json({ message: "invalid input parameters" });
      return;
    }

    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);

    const response = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const id = response.id;

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "Invalid jwt token" });
    }

    const token = jwt.sign({ email, id }, jwtSecret, { expiresIn: "7d" });
    console.log("token for auth: ", token);
    return res
      .cookie("auth-token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .status(200)
      .json({ message: "user created successfully!" });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return res.status(401).json({ message: "email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

// log existing user in
router.post("/signin", async (req, res) => {
  try {
    const { success } = singInSchema.safeParse(req.body);
    if (!success) {
      return res.status(401).json({ message: "invalid inputs" });
    }

    const { email, password } = req.body;
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(401).json({ message: "invalid password" });
    }
    const id = user.id;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "Invalid jwt token" });
    }

    const token = jwt.sign({ email, id }, jwtSecret, { expiresIn: "7d" });

    return res
      .cookie("auth-token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: true,
      })
      .status(200)
      .json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
