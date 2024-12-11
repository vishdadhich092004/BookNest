import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user";

const backendUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DEPLOYED_URL
    : process.env.BACKEND_URL;

const callbackURL = `/api/auth/google/callback`;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails![0].value });

        if (user && !user.googleId) {
          user.googleId = profile.id;
          user.picture = profile.photos?.[0].value;
          await user.save();
          return done(null, user);
        }

        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails![0].value,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            picture: profile.photos?.[0].value,
            role: "user",
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("Error in Google OAuth : ", error);
        return done(error as Error);
      }
    }
  )
);

// Serialization functions remain the same
passport.serializeUser((user: any, done) => {
  done(null, (user as any)._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
