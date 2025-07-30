import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoginButton } from "@/components/auth/login-button";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { MicrosoftLoginButton } from "@/components/auth/microsoft-login-button";

interface AuthSectionProps {
  title?: string;
  description?: string;
  showReplit?: boolean;
  showGoogle?: boolean;
  showMicrosoft?: boolean;
}

export function AuthSection({ 
  title = "Sign in to PropertyFlow",
  description = "Choose your preferred sign-in method",
  showReplit = true,
  showGoogle = true,
  showMicrosoft = true
}: AuthSectionProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showReplit && (
          <LoginButton className="w-full" size="lg" />
        )}
        
        {(showGoogle || showMicrosoft) && showReplit && (
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