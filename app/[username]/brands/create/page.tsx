"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateBrandPageProps {
  params: {
    username: string;
  };
}

export default function CreateBrandPage({ params }: CreateBrandPageProps) {
  const { username } = params;
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Check if the current user is the owner of this profile
  const isOwner = isAuthenticated && user.username === username;
  
  // If not the owner, redirect to the brands page
  if (!isOwner) {
    router.push(`/${username}/brands`);
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from name if slug field is empty
    if (name === 'name' && !formData.slug) {
      setFormData({
        ...formData,
        [name]: value,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      // Here you would implement the actual brand creation logic
      // For now, just simulate a delay and redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to brands page after creation
      router.push(`/${username}/brands`);
    } catch (error: any) {
      setError(error.message || "Failed to create brand. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create Brand</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Brand Name
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
          <label htmlFor="slug" className="text-sm font-medium">
            Brand Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            className="w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={formData.slug}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">
            This will be used in the URL: shopkart.bio/{username}/{formData.slug || 'brand-slug'}
          </p>
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
        
        <div className="flex space-x-3 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Brand"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/${username}/brands`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}