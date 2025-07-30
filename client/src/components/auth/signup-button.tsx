import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface SignupButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function SignupButton({ className, variant = "outline", size = "default" }: SignupButtonProps) {
  const handleSignup = () => {
    // Replit Auth handles both login and signup through the same flow
    // The user will be prompted to create an account if they don't have one
    window.location.href = "/api/login";
  };

  return (
    <Button 
      onClick={handleSignup}
      className={className}
      variant={variant}
      size={size}
    >
      <UserPlus className="h-4 w-4 mr-2" />
      Sign Up with Replit
    </Button>
  );
}