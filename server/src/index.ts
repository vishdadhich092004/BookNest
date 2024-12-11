import express from "express";
import "dotenv/config";
import cors from "cors";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import discussionRoutes from "./routes/discussions";
import commentRoutes from "./routes/comments";
import bookRoutes from "./routes/books";
import authorRoutes from "./routes/authors";
import genreRoutes from "./routes/genres";
import reviewRoutes from "./routes/reviews";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import searchRoutes from "./routes/search";
import passport from "./config/passport";
import { db } from "./services/db";
const app = express();

// initialise the db
db();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.DEPLOYED_URL
        : process.env.FRONTEND_URL,
    credentials: true,
  })
);

// passport
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY!, // Used a separate secret for sessions
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/books", reviewRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/discussions", commentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/authors", authorRoutes);
/* AT THE END */
//catchall path : solves reload issues during production
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});
app.listen(4000, () => {
  console.log("Port 4000 Activated!");
});
