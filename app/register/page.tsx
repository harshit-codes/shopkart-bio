"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createUserAccount } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const { checkAuthUser, isRateLimited, rateLimitWaitTime, signIn, user, isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(0);
  
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // If rate limited, show message and prevent submission
    if (isRateLimited && countdown > 0) {
      setError(`Too many requests. Please try again in ${countdown} seconds.`);
      return;
    }

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // Additional password strength validation
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    
    if (!(hasUpperCase && hasLowerCase && (hasNumbers || hasSpecialChars))) {
      setError("Password must contain uppercase and lowercase letters, and at least one number or special character");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Starting registration process...");
      
      // Create user account
      const newUser = await createUserAccount({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      console.log("User account created:", newUser);

      // Add a longer delay before checking authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if user is authenticated after registration
      console.log("Checking if user is authenticated...");
      let isUserAuthenticated = await checkAuthUser();
      console.log("First authentication check result:", isUserAuthenticated);
      
      // If first check fails, try again after a delay
      if (!isUserAuthenticated) {
        console.log("First auth check failed, waiting and trying again...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        isUserAuthenticated = await checkAuthUser();
        console.log("Second authentication check result:", isUserAuthenticated);
      }

      if (isUserAuthenticated) {
        console.log("User authenticated, redirecting to profile");
        // Redirect to user profile using username
        if (user && user.username) {
          router.push(`/${user.username}`);
        } else {
          // Fallback in case username is not available yet
          router.push("/");
        }
      } else {
        console.log("Authentication check failed, trying direct sign-in");
        
        // If the automatic authentication check failed, try signing in manually
        try {
          // Add a delay before trying to sign in
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await signIn(formData.email, formData.password);
          // signIn will handle redirection if successful
        } catch (signInError) {
          console.error("Manual sign-in failed:", signInError);
          
          // If manual sign-in fails, but account was created
          if (newUser && newUser.$id) {
            throw new Error("Account created successfully! Please try signing in on the login page.");
          }
          
          throw new Error("Registration successful but could not sign you in automatically. Please try signing in manually.");
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error?.message?.includes("rate limit") || error?.message?.includes("Rate limit")) {
        setError(`Too many registration attempts. Please try again in ${countdown || 30} seconds.`);
      } else if (error?.message?.includes("already exists")) {
        setError("An account with this email already exists. Please sign in instead.");
      } else if (error?.message?.includes("Registration successful but could not sign you in")) {
        // This is a partial success - the account was created
        setError("Your account was created successfully, but we couldn't sign you in automatically. Please go to the login page and sign in with your credentials.");
      } else if (error?.message?.includes("Sign in failed")) {
        setError("Your account was created but we couldn't sign you in. Please try again on the login page.");
      } else {
        setError(error?.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 md:p-24">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground">Register for ShopKart.bio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}
          
          {isRateLimited && countdown > 0 && (
            <div className="rounded-md bg-amber-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Rate limit exceeded</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>Too many registration attempts. Please try again in {countdown} seconds.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={formData.password}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters with uppercase and lowercase letters, and at least one number or special character
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || (isRateLimited && countdown > 0)}
          >
            {isLoading ? "Creating account..." : (isRateLimited && countdown > 0) ? `Try again in ${countdown}s` : "Sign up"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}