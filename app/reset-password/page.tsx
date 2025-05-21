"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { completePasswordReset, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    // Validate URL parameters
    if (!userId || !secret) {
      setError("Invalid password reset link. Please request a new one.");
    }
  }, [userId, secret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate passwords
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Additional password strength validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!(hasUpperCase && hasLowerCase && (hasNumbers || hasSpecialChars))) {
      setError("Password must contain uppercase and lowercase letters, and at least one number or special character");
      return;
    }

    if (!userId || !secret) {
      setError("Invalid password reset link. Please request a new one.");
      return;
    }

    try {
      await completePasswordReset(userId, secret, password, confirmPassword);
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      // Provide more specific error messages
      if (error?.message?.includes("expired") || error?.message?.includes("invalid token")) {
        setError("This password reset link has expired. Please request a new one.");
      } else if (error?.message?.includes("password strength")) {
        setError("Your password is too weak. Please choose a stronger password with a mix of letters, numbers, and special characters.");
      } else {
        setError(
          error?.message || "Failed to reset password. Please try again."
        );
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 md:p-24">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">Create a new password</p>
        </div>

        {success ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Password reset successful
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your password has been updated. You will be redirected to the
                    login page.
                  </p>
                </div>
                <div className="mt-4">
                  <Link href="/login">
                    <Button
                      type="button"
                      variant="link"
                      className="text-primary"
                    >
                      Go to login
                    </Button>
                  </Link>
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
              <label htmlFor="password" className="text-sm font-medium">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!userId || !secret}
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase and lowercase letters, and at least one number or special character
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!userId || !secret}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !userId || !secret}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>

            <div className="text-center text-sm">
              <p>
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
