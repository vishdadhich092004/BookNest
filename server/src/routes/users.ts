import express from "express";
import { check } from "express-validator";
import { verifyToken } from "../middleware/auth";
import * as userControllers from "../controllers/userControllers";
const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  userControllers.register
);

router.get("/:userId/comments", userControllers.getUserComments);
router.get("/:userId/discussions", userControllers.getUserDiscussions);

router.get("/:userId/books", userControllers.getUserBooks);

router.delete("/delete", verifyToken, userControllers.deleteUser);

export default router;
