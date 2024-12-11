import express from "express";
import { check } from "express-validator";
import { verifyToken } from "../middleware/auth";
import * as userControllers from "../controllers/userControllers";
const router = express.Router();

// create a new user
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

// fetch commnents by a particular user
router.get("/:userId/comments", userControllers.getUserComments);
// fetch discussions by a particular user
router.get("/:userId/discussions", userControllers.getUserDiscussions);
// fetch books by a particular user
router.get("/:userId/books", userControllers.getUserBooks);
// delete the user
router.delete("/delete", verifyToken, userControllers.deleteUser);

export default router;
