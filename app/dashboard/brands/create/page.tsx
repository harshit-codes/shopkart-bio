"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { createBrand } from "@/lib/brand";

export default function CreateBrandPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogo(e.target.files[0]);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBanner(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Brand name is required");
      return;
    }

    try {
      setIsLoading(true);
      
      await createBrand({
        name: formData.name,
        description: formData.description,
        logo: logo || undefined,
        banner: banner || undefined,
        owner: user.$id,
      });

      router.push("/dashboard/brands");
    } catch (error: any) {
      console.error("Create brand error:", error);
      setError(error?.message || "Failed to create brand. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Brand</h1>
        <p className="text-muted-foreground">
          Set up a new brand to start selling products
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Brand Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Brand Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="logo" className="text-sm font-medium">
            Brand Logo
          </label>
          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/*"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onChange={handleLogoChange}
          />
          <p className="text-xs text-muted-foreground">
            Recommended size: 512x512px
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="banner" className="text-sm font-medium">
            Brand Banner
          </label>
          <input
            id="banner"
            name="banner"
            type="file"
            accept="image/*"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onChange={handleBannerChange}
          />
          <p className="text-xs text-muted-foreground">
            Recommended size: 1200x300px
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating brand..." : "Create Brand"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}