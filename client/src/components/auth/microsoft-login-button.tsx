import { Button } from "@/components/ui/button";

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
      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
        <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
      </svg>
      Continue with Microsoft
    </Button>
  );
}