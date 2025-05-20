"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBrandsByOwner } from "@/lib/brand";
import { IBrand } from "@/types";

export default function BrandsPage() {
  const { user, isAuthenticated } = useAuth();
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      if (!isAuthenticated || !user.$id) return;

      try {
        setIsLoading(true);
        const fetchedBrands = await getBrandsByOwner(user.$id);
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setError("Failed to load brands. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, [isAuthenticated, user.$id]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Brands</h1>
          <p className="text-muted-foreground">
            Manage your brands and their products
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/brands/create">Create Brand</Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p>Loading brands...</p>
        </div>
      ) : brands.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">No brands yet</h3>
          <p className="mb-6 text-muted-foreground">
            Create your first brand to get started selling products
          </p>
          <Button asChild>
            <Link href="/dashboard/brands/create">Create Your First Brand</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div
              key={brand.$id}
              className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm"
            >
              {/* Brand Banner */}
              <div className="relative h-32 w-full bg-muted">
                {brand.bannerUrl ? (
                  <img
                    src={brand.bannerUrl}
                    alt={`${brand.name} banner`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900">
                    <span className="text-lg font-semibold text-muted-foreground">
                      {brand.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Brand Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center gap-4">
                  {/* Brand Logo */}
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={`${brand.name} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary text-lg font-bold text-primary-foreground">
                        {brand.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(brand.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-6 flex-grow text-sm text-muted-foreground">
                  {brand.description
                    ? brand.description.length > 100
                      ? `${brand.description.substring(0, 100)}...`
                      : brand.description
                    : "No description provided."}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button asChild variant="default" className="flex-1">
                    <Link href={`/dashboard/brands/${brand.$id}`}>
                      Manage
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1"
                  >
                    <Link href={`/brand/${brand.slug}`} target="_blank">
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}