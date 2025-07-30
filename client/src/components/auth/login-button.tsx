import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface LoginButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function LoginButton({ className, variant = "default", size = "default" }: LoginButtonProps) {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <Button 
      onClick={handleLogin}
      className={className}
      variant={variant}
      size={size}
    >
      <LogIn className="h-4 w-4 mr-2" />
      Sign In with Replit
    </Button>
  );
}