import express from "express";
import { check } from "express-validator";
import * as middleware from "../middleware/auth";
import passport from "../config/passport";
import * as authControllers from "../controllers/authControllers";
const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password cannot be empty").notEmpty(),
  ],
  authControllers.login
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authControllers.googleCallback
);

router.get(
  "/validate-token",
  middleware.verifyToken,
  authControllers.validateToken
);

router.post("/logout", authControllers.logout);

export default router;
