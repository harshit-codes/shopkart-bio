"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn, isLoading, isRateLimited, rateLimitWaitTime, user, isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  
  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated && user && user.username) {
      // Redirect to callback URL if provided, otherwise to user profile
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push(`/${user.username}`);
      }
    }
  }, [isAuthenticated, user, router, callbackUrl]);

  // Set up countdown timer when rate limited
  useEffect(() => {
    if (isRateLimited && rateLimitWaitTime > 0) {
      setCountdown(rateLimitWaitTime);
      const timer = setInterval(() => {
        setCountdown(prevCount => {
          if (prevCount <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isRateLimited, rateLimitWaitTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Form submission started");

    // If rate limited, show message and prevent submission
    if (isRateLimited && countdown > 0) {
      setError(`Too many requests. Please try again in ${countdown} seconds.`);
      return;
    }

    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    try {
      console.log("Attempting to sign in...");
      await signIn(email, password);
      console.log("Sign in function completed successfully");
      // Redirection handled in useEffect above
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error?.message?.includes("Invalid credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (error?.message?.includes("rate limit") || error?.message?.includes("Rate limit")) {
        setError(`Too many login attempts. Please try again in ${countdown || 30} seconds.`);
      } else if (error?.message?.includes("User not found")) {
        setError("Account not found. Please check your email or sign up.");
      } else if (error?.message?.includes("network")) {
        setError("Network error. Please check your internet connection.");
      } else if (error?.message?.includes("session is active") || error?.message?.includes("prohibited when a session")) {
        setError("You're already logged in with a different account. Please sign out first.");
      } else {
        setError(error?.message || "Failed to sign in. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 md:p-24">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {isRateLimited && countdown > 0 ? (
          <div className="rounded-md bg-amber-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Rate limit exceeded</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>Too many login attempts. Please try again in {countdown} seconds.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isRateLimited && countdown > 0}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isRateLimited && countdown > 0}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || (isRateLimited && countdown > 0)}
            >
              {isLoading ? "Signing in..." : (isRateLimited && countdown > 0) ? `Try again in ${countdown}s` : "Sign in"}
            </Button>
          </form>
        )}

        <div className="text-center text-sm">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}