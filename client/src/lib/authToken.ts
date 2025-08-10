// Token management utilities for CodeIgniter JWT backend

const TOKEN_KEY = 'auth_token';

export const authToken = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  remove(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  exists(): boolean {
    return this.get() !== null;
  }
};

// Update auth state when token changes
export const handleAuthSuccess = (token: string, user: any) => {
  authToken.set(token);
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('auth-change', { detail: { user, authenticated: true } }));
};

export const handleAuthLogout = () => {
  authToken.remove();
  window.dispatchEvent(new CustomEvent('auth-change', { detail: { user: null, authenticated: false } }));
};