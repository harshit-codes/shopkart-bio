"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BrandsPageProps {
  params: {
    username: string;
  };
}

export default function BrandsPage({ params }: BrandsPageProps) {
  const { username } = params;
  const { user, isAuthenticated } = useAuth();
  const isOwner = isAuthenticated && user.username === username;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Brands</h1>
        {isOwner && (
          <Button asChild>
            <Link href={`/${username}/brands/create`}>Create Brand</Link>
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card p-8">
        {isOwner ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              You don't have any brands yet. Create your first brand to get started.
            </p>
            <Button asChild>
              <Link href={`/${username}/brands/create`}>Create Brand</Link>
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">
              {username} doesn't have any public brands yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}