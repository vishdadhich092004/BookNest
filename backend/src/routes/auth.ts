import express, { Response, Request } from "express";
import User from "../models/user";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as middleware from "../middleware/auth";
import { Role, assignPermissions } from "../config/rolesConfig";
import { AuthRequest } from "../middleware/auth";
import passport from "../config/passport";
const router = express.Router();

const redirectUri =
  process.env.NODE_ENV === "production"
    ? `${process.env.DEPLOYED_URL}`
    : `${process.env.FRONTEND_URL}`;

console.log(redirectUri);
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password cannot be empty").notEmpty(),
  ],
  async (req: Request, res: Response) => {
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
  }
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = jwt.sign(
      { userId: user._id, role: user.role, permissions: user.permissions },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend URL
    res.redirect(redirectUri);
  }
);

router.get(
  "/validate-token",
  middleware.verifyToken,
  async (req: AuthRequest, res: Response) => {
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
  }
);

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
