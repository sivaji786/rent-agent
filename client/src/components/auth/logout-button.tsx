import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export const LogoutButton = React.forwardRef<HTMLButtonElement, LogoutButtonProps>(
  ({ className, variant = "ghost", size = "default" }, ref) => {
    const handleLogout = () => {
      window.location.href = "/api/logout";
    };

    return (
      <Button 
        ref={ref}
        onClick={handleLogout}
        className={className}
        variant={variant}
        size={size}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    );
  }
);

LogoutButton.displayName = "LogoutButton";