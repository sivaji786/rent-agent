import { Button } from "@/components/ui/button";
import { SiMicrosoft } from "react-icons/si";

interface MicrosoftLoginButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function MicrosoftLoginButton({ className, variant = "outline", size = "default" }: MicrosoftLoginButtonProps) {
  const handleMicrosoftLogin = () => {
    window.location.href = "/api/auth/microsoft";
  };

  return (
    <Button 
      onClick={handleMicrosoftLogin}
      className={className}
      variant={variant}
      size={size}
    >
      <SiMicrosoft className="h-4 w-4 mr-2" />
      Continue with Microsoft
    </Button>
  );
}