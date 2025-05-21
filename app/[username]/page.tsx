"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Store, Package, ShoppingCart, BarChart2, Settings, LayoutDashboard, User } from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";

// Interface for the page props
interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params;
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  
  // Navigation links with icons
  const navLinks = [
    { name: "Dashboard", href: `/${username}`, icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Brands", href: `/${username}/brands`, icon: <Store className="h-4 w-4" /> },
    { name: "Products", href: `/${username}/products`, icon: <Package className="h-4 w-4" /> },
    { name: "Orders", href: `/${username}/orders`, icon: <ShoppingCart className="h-4 w-4" /> },
    { name: "Analytics", href: `/${username}/analytics`, icon: <BarChart2 className="h-4 w-4" /> },
    { name: "Profile", href: `/${username}/profile`, icon: <User className="h-4 w-4" /> },
    { name: "Settings", href: `/${username}/settings`, icon: <Settings className="h-4 w-4" /> },
  ];

  useEffect(() => {
    // Check if current user is the profile owner
    if (isAuthenticated && user.username === username) {
      setIsOwner(true);
    } else if (isAuthenticated && user.username !== username) {
      // If authenticated but not the owner, this is someone else's profile
      setIsOwner(false);
    }
  }, [isAuthenticated, user, username]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header component can be extracted to a shared component */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold">
              ShopKart.bio
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <span className="text-sm">Welcome, {user.name}</span>
            )}
            {!isAuthenticated && (
              <div className="space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container flex gap-8 py-8">
        {/* Sidebar for profile owner */}
        {isOwner && <Sidebar items={navLinks} />}

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col gap-8">
            <section>
              <h1 className="mb-4 text-3xl font-bold">
                {isOwner ? "My Dashboard" : `${username}'s Profile`}
              </h1>
              <p className="text-muted-foreground">
                {isOwner 
                  ? "Welcome to your ShopKart.bio dashboard. Manage your brands and products here."
                  : `Welcome to ${username}'s ShopKart.bio profile.`}
              </p>
            </section>
            
            {/* Dashboard content for profile owner */}
            {isOwner && (
              <>
                <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Create Brand Card */}
                  <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="mb-2 text-xl font-semibold">Create a Brand</h3>
                    <p className="mb-4 flex-grow text-sm text-muted-foreground">
                      Set up your own brand identity and start selling products online.
                    </p>
                    <Button asChild className="mt-auto">
                      <Link href={`/${username}/brands/create`}>Create Brand</Link>
                    </Button>
                  </div>

                  {/* My Brands Card */}
                  <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="mb-2 text-xl font-semibold">My Brands</h3>
                    <p className="mb-4 flex-grow text-sm text-muted-foreground">
                      View and manage all your brands in one place.
                    </p>
                    <Button asChild variant="outline" className="mt-auto">
                      <Link href={`/${username}/brands`}>View Brands</Link>
                    </Button>
                  </div>

                  {/* Analytics Card */}
                  <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="mb-2 text-xl font-semibold">Analytics</h3>
                    <p className="mb-4 flex-grow text-sm text-muted-foreground">
                      Track your sales, views, and engagement metrics.
                    </p>
                    <Button asChild variant="outline" className="mt-auto">
                      <Link href={`/${username}/analytics`}>View Analytics</Link>
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
              </>
            )}
            
            {/* Public profile view for non-owners */}
            {!isOwner && (
              <section className="rounded-lg border bg-card p-6">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    This is {username}'s public profile. You can see their brands and products here.
                  </p>
                  
                  {/* This would be populated with public information about the user */}
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Brands</h2>
                    <p className="text-muted-foreground">No public brands to display.</p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}