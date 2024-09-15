import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user";
import { assignPermissions } from "../config/rolesConfig";

const getRedirectUri = () => {
  if (process.env.NODE_ENV === "production") {
    return `${process.env.DEPLOYED_URL}/auth/google/callback`;
  }
  return "http://localhost:4000/api/auth/google/callback";
};

const redirectUri = getRedirectUri();

console.log("Passport Redirect URI:", redirectUri); // Add this log to debug

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: redirectUri,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails![0].value,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            picture: profile.photos?.[0].value,
            role: "user",
          });

          user.permissions = assignPermissions("user");
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Serialization functions remain the same
passport.serializeUser((user: any, done) => {
  done(null, user.id);
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
