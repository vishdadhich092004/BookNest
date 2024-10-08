import { assignPermissions, Role } from "../config/rolesConfig";
import { AuthRequest } from "../middleware/auth";
import User from "../models/user";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

const frontendUrl =
  process.env.NODE_ENV === "production"
    ? "https://booknest-e8f0.onrender.com"
    : "http://localhost:5173";

export const validateToken = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Omit sensitive information like password
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ user: userWithoutPassword });
  } catch (e) {
    console.error("Error validating token:", e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as any;
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      permissions: assignPermissions(user.role),
    },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "1d" }
  );

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.redirect(`${frontendUrl}`);
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const permissions = assignPermissions(user.role as Role);
    const token = jwt.sign(
      { userId: user._id, role: user.role, permissions }, // Use _id for MongoDB ObjectId
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Return the full user details
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
