import passport from "passport";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import type { Express } from "express";
import { storage } from "./storage";

export async function setupMicrosoftAuth(app: Express) {
  if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_CLIENT_SECRET) {
    console.warn("Microsoft OAuth credentials not configured. Skipping Microsoft auth setup.");
    return;
  }

  passport.use('microsoft', new MicrosoftStrategy({
    identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid_configuration',
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    responseType: 'code',
    responseMode: 'form_post',
    redirectUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/microsoft/callback`,
    allowHttpForRedirectUrl: process.env.NODE_ENV === 'development',
    scope: ['profile', 'email'],
    useCookieInsteadOfSession: false,
    cookieEncryptionKeys: [
      { 'key': process.env.SESSION_SECRET || 'default-key', 'iv': '123456789012' }
    ],
    passReqToCallback: false
  }, async (iss, sub, profile, accessToken, refreshToken, done) => {
    try {
      // Extract user information from Microsoft profile
      const email = profile.upn || profile.emails?.[0]?.value;
      const name = profile.displayName;
      const firstName = profile.name?.givenName;
      const lastName = profile.name?.familyName;
      
      if (!email) {
        return done(new Error("No email found in Microsoft profile"), null);
      }

      // Create or update user in database
      const user = await storage.upsertUser({
        id: `microsoft_${sub}`,
        email,
        firstName,
        lastName,
        profileImageUrl: null, // Microsoft doesn't provide profile images in basic scope
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
      console.error("Microsoft auth error:", error);
      return done(error, null);
    }
  }));

  // Microsoft auth routes
  app.get("/api/auth/microsoft", 
    passport.authenticate('microsoft')
  );

  app.get("/api/auth/microsoft/callback",
    passport.authenticate('microsoft', { failureRedirect: '/?error=microsoft_auth_failed' }),
    (req, res) => {
      res.redirect('/');
    }
  );
}