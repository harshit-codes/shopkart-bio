"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authenticated, redirect to the username route
    if (isAuthenticated && user && user.username) {
      router.push(`/${user.username}`);
    } else if (!isLoading && !isAuthenticated) {
      // If not authenticated and not loading, redirect to login
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Show loading state
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Redirecting...</p>
    </div>
  );
}