"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { username } = params;

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?callbackUrl=/${username}`);
    }
  }, [isAuthenticated, isLoading, router, username]);

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // If authenticated but not the owner, they can view as public profile
  return <>{children}</>;
}