import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { MicrosoftLoginButton } from "@/components/auth/microsoft-login-button";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";

interface AuthSectionProps {
  title?: string;
  description?: string;
  showReplit?: boolean;
  showGoogle?: boolean;
  showMicrosoft?: boolean;
  showManual?: boolean;
}

export function AuthSection({ 
  title = "Sign in to Prolits",
  description = "Choose your preferred sign-in method",
  showReplit = true,
  showGoogle = true,
  showMicrosoft = true,
  showManual = true
}: AuthSectionProps) {
  const [mode, setMode] = useState<"providers" | "login" | "signup">("providers");

  if (mode === "login") {
    return (
      <div className="space-y-4">
        <LoginForm 
          onSwitchToSignup={() => setMode("signup")}
        />
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setMode("providers")}
            className="text-sm text-muted-foreground"
          >
            ← Back to sign-in options
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "signup") {
    return (
      <div className="space-y-4">
        <SignupForm 
          onSwitchToLogin={() => setMode("login")}
        />
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setMode("providers")}
            className="text-sm text-muted-foreground"
          >
            ← Back to sign-in options
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showManual && (
          <div className="space-y-3">
            <Button 
              onClick={() => setMode("login")}
              className="w-full" 
              size="lg"
            >
              Sign In with Email
            </Button>
            <Button 
              onClick={() => setMode("signup")}
              variant="outline"
              className="w-full" 
              size="lg"
            >
              Create New Account
            </Button>
          </div>
        )}
        
        {(showReplit || showGoogle || showMicrosoft) && showManual && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {showReplit && (
            <LoginButton className="w-full" size="lg" />
          )}
          {showGoogle && (
            <GoogleLoginButton className="w-full" size="lg" />
          )}
          {showMicrosoft && (
            <MicrosoftLoginButton className="w-full" size="lg" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}