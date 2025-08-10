import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [, navigate] = useLocation();

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-4">
        {mode === "login" ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}
        
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="link"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="px-0"
              data-testid={mode === "login" ? "link-register" : "link-login"}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}