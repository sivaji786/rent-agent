import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPassword() {
  const [location] = useLocation();
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    // Extract token from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    
    if (resetToken) {
      setToken(resetToken);
    } else {
      // Redirect to home if no token provided
      window.location.href = "/";
    }
  }, [location]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}