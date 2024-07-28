import express, { Response, Request } from "express";
import User from "../models/user";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
const router = express.Router();
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password cannot be empty").notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user)
        // no email found!
        return res.status(400).json({ message: "Invalid Credentials" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        // password is incorrect
        return res.status(400).json({ message: "Invalid Credentials" });

      // perfect match found!
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ userId: user._id });
    } catch (e) {
      // console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

// router.post("/logout", (req: Request, res: Response) => {
//   res.cookie("auth_token", "", {
//     expires: new Date(0),
//   });
//   res.send();
// });

export default router;
