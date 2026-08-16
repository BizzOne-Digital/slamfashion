"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("from") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(password);
    setLoading(false);

    if (result.success) {
      router.push(redirectTo);
      router.refresh();
    } else {
      setError(result.error || "Invalid credentials");
      setPassword("");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 pt-[120px]">
      <div className="absolute inset-0 bg-gradient-to-b from-surface to-black -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Logo size="md" className="justify-center" />
          <p className="mt-6 text-gold text-xs font-bold tracking-[0.3em] uppercase">
            Admin Access
          </p>
          <h1 className="mt-2 text-2xl font-black text-white">Sign In</h1>
          <p className="mt-2 text-sm text-white/40">
            Authorized personnel only. Customers cannot access this area.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 bg-surface rounded-2xl border border-white/10 space-y-6"
        >
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold tracking-wider uppercase text-white/40 mb-2"
            >
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-surface-light border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Enter admin password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gold text-black text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/40 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
