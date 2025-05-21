"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default function ProfileSettingsPage({ params }: ProfilePageProps) {
  const { username } = params;
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    bio: user.bio || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Check if the current user is the owner of this profile
  const isOwner = isAuthenticated && user.username === username;
  
  // If not the owner, redirect to the profile page
  if (!isOwner) {
    router.push(`/${username}`);
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);
    
    try {
      // Here you would implement the actual profile update logic
      // For now, just simulate a delay and show success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
                Profile updated successfully!
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
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
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={formData.username}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                This will be used in your profile URL: shopkart.bio/{formData.username}
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled
                className="w-full rounded-md border bg-background/80 px-3 py-2 text-muted-foreground"
                value={formData.email}
              />
              <p className="text-xs text-muted-foreground">
                Your email address cannot be changed
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                className="w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={formData.bio}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Tell others a bit about yourself
              </p>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Profile Picture</h2>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-4xl">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <Button variant="outline" size="sm">
              Change Photo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}