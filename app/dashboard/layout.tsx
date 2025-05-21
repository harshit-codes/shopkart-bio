"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  // Just render the children (which is our redirect page)
  return <>{children}</>;
}