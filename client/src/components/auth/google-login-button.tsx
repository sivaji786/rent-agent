import { Button } from "@/components/ui/button";
import { SiGoogle } from "react-icons/si";

interface GoogleLoginButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function GoogleLoginButton({ className, variant = "outline", size = "default" }: GoogleLoginButtonProps) {
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <Button 
      onClick={handleGoogleLogin}
      className={className}
      variant={variant}
      size={size}
    >
      <SiGoogle className="h-4 w-4 mr-2" />
      Continue with Google
    </Button>
  );
}