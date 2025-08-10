import { useQuery } from "@tanstack/react-query";
import { authToken } from "@/lib/authToken";
import { useEffect, useState } from "react";

export function useAuth() {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: any;
  }>({
    isAuthenticated: authToken.exists(),
    user: null
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: authState.isAuthenticated,
    retry: false,
  });

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = (event: CustomEvent) => {
      setAuthState({
        isAuthenticated: event.detail.authenticated,
        user: event.detail.user
      });
    };

    window.addEventListener('auth-change', handleAuthChange as EventListener);
    return () => window.removeEventListener('auth-change', handleAuthChange as EventListener);
  }, []);

  // Update auth state when user data is fetched
  useEffect(() => {
    if (user) {
      setAuthState(prev => ({ ...prev, user }));
    }
  }, [user]);

  return {
    user: user || authState.user,
    isLoading,
    isAuthenticated: authState.isAuthenticated && !!authToken.get(),
  };
}
