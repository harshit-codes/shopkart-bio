"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // If not authenticated, don't render anything (will be redirected)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            ShopKart.bio
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <div className="flex flex-col gap-8">
          <section>
            <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your ShopKart.bio dashboard. Manage your brands and products here.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Create Brand Card */}
            <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold">Create a Brand</h3>
              <p className="mb-4 flex-grow text-sm text-muted-foreground">
                Set up your own brand identity and start selling products online.
              </p>
              <Button asChild className="mt-auto">
                <Link href="/dashboard/brands/create">Create Brand</Link>
              </Button>
            </div>

            {/* My Brands Card */}
            <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold">My Brands</h3>
              <p className="mb-4 flex-grow text-sm text-muted-foreground">
                View and manage all your brands in one place.
              </p>
              <Button asChild variant="outline" className="mt-auto">
                <Link href="/dashboard/brands">View Brands</Link>
              </Button>
            </div>

            {/* Analytics Card */}
            <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold">Analytics</h3>
              <p className="mb-4 flex-grow text-sm text-muted-foreground">
                Track your sales, views, and engagement metrics.
              </p>
              <Button asChild variant="outline" className="mt-auto">
                <Link href="/dashboard/analytics">View Analytics</Link>
              </Button>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>
            <div className="rounded-lg border bg-card p-6">
              <p className="text-center text-muted-foreground">
                No recent activity to display. Create a brand to get started!
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}