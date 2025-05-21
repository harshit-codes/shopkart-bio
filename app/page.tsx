"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to their profile page
  useEffect(() => {
    if (isAuthenticated && user && user.username) {
      router.push(`/${user.username}`);
    }
  }, [isAuthenticated, router, user]);

  // If loading or authenticated, show loading state
  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-24">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">
          Welcome to ShopKart.bio
        </h1>
        <p className="text-xl text-muted-foreground">
          Create your brand and sell products or services online
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}