"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthContextValue {
  isAdmin: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch("/api/admin/session");
        const data = (await res.json()) as { authenticated: boolean };
        if (!cancelled) setIsAdmin(data.authenticated);
      } catch {
        if (!cancelled) setIsAdmin(false);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/session");
      const data = (await res.json()) as { authenticated: boolean };
      setIsAdmin(data.authenticated);
    } catch {
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (password: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        return { success: false, error: data.error || "Login failed" };
      }

      setIsAdmin(true);
      return { success: true };
    } catch {
      return { success: false, error: "Unable to connect. Try again." };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setIsAdmin(false);
    }
  }, []);

  const value = useMemo(
    () => ({ isAdmin, isLoading, login, logout, refreshSession }),
    [isAdmin, isLoading, login, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
