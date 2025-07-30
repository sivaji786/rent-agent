import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { Express } from "express";
import { storage } from "./storage";
import { emailService } from "./emailService";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function setupLocalAuth(app: Express) {
  // Local strategy for email/password authentication
  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      if (!user.passwordHash) {
        return done(null, false, { message: 'Please sign in with your OAuth provider' });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Create session data compatible with other auth methods
      const sessionUser = {
        claims: {
          sub: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          profile_image_url: user.profileImageUrl,
        },
        access_token: 'local_token',
        expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hours
      };

      return done(null, sessionUser);
    } catch (error) {
      console.error("Local auth error:", error);
      return done(error);
    }
  }));

  // Manual signup route
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = signupSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const user = await storage.upsertUser({
        email,
        firstName,
        lastName,
        passwordHash,
        authProvider: 'manual',
      });

      // Create session
      const sessionUser = {
        claims: {
          sub: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          profile_image_url: user.profileImageUrl,
        },
        access_token: 'local_token',
        expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hours
      };

      req.login(sessionUser, (err) => {
        if (err) {
          console.error("Session creation error:", err);
          return res.status(500).json({ error: "Failed to create session" });
        }
        res.json({ success: true, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // Manual login route
  app.post("/api/auth/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
    } catch (error) {
      return res.status(400).json({ error: "Invalid email or password format" });
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Authentication failed" });
      }
      
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid email or password" });
      }

      req.login(user, (err) => {
        if (err) {
          console.error("Session creation error:", err);
          return res.status(500).json({ error: "Failed to create session" });
        }
        
        res.json({ 
          success: true, 
          user: { 
            id: user.claims.sub, 
            email: user.claims.email, 
            firstName: user.claims.first_name, 
            lastName: user.claims.last_name 
          } 
        });
      });
    })(req, res, next);
  });

  // Forgot password route
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({ success: true, message: "If an account exists with that email, a reset link has been sent." });
      }

      // Only allow password reset for manual auth users
      if (user.authProvider !== 'manual') {
        return res.status(400).json({ error: "Password reset is only available for email accounts. Please use your OAuth provider to sign in." });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Save reset token to database
      await storage.setResetToken(user.id, resetToken, resetTokenExpiry);

      // Send reset email
      await emailService.sendPasswordResetEmail(email, resetToken, user.firstName || undefined);

      res.json({ success: true, message: "If an account exists with that email, a reset link has been sent." });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to process password reset request" });
    }
  });

  // Reset password route
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);

      // Find user by reset token
      const user = await storage.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      // Check if token is expired
      if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
        return res.status(400).json({ error: "Reset token has expired" });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(password, 12);

      // Update password and clear reset token
      await storage.updateUserPassword(user.id, passwordHash);

      res.json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  // Verify reset token route
  app.get("/api/auth/verify-reset-token/:token", async (req, res) => {
    try {
      const { token } = req.params;

      const user = await storage.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ error: "Invalid reset token" });
      }

      // Check if token is expired
      if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
        return res.status(400).json({ error: "Reset token has expired" });
      }

      res.json({ valid: true, email: user.email });

    } catch (error) {
      console.error("Verify reset token error:", error);
      res.status(500).json({ error: "Failed to verify reset token" });
    }
  });
}