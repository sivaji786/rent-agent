import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Express } from "express";
import { storage } from "./storage";

export async function setupGoogleAuth(app: Express) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("Google OAuth credentials not configured. Skipping Google auth setup.");
    return;
  }

  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract user information from Google profile
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName;
      const firstName = profile.name?.givenName;
      const lastName = profile.name?.familyName;
      const profileImageUrl = profile.photos?.[0]?.value;

      if (!email) {
        return done(new Error("No email found in Google profile"), null);
      }

      // Create or update user in database
      const user = await storage.upsertUser({
        id: `google_${profile.id}`,
        email,
        firstName,
        lastName,
        profileImageUrl,
      });

      // Create session data
      const sessionUser = {
        claims: {
          sub: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          profile_image_url: user.profileImageUrl,
        },
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      };

      return done(null, sessionUser);
    } catch (error) {
      console.error("Google auth error:", error);
      return done(error, null);
    }
  }));

  // Google auth routes
  app.get("/api/auth/google", 
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate('google', { failureRedirect: '/?error=google_auth_failed' }),
    (req, res) => {
      res.redirect('/');
    }
  );
}