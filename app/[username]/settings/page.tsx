"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsPageProps {
  params: {
    username: string;
  };
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const { username } = params;
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  
  // Check if the current user is the owner of this profile
  const isOwner = isAuthenticated && user.username === username;
  
  // If not the owner, redirect to the profile page
  if (!isOwner) {
    router.push(`/${username}`);
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="account">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-base">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-base">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-base">@{user.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Account ID</p>
                  <p className="text-base text-muted-foreground">{user.$id}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button asChild variant="outline">
                  <Link href={`/${username}/profile`}>Edit Profile</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6 border-destructive/20">
            <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              These actions cannot be undone. Please be certain.
            </p>
            
            <div className="space-y-4">
              <div>
                <Button variant="outline" className="text-destructive">
                  Delete Account
                </Button>
              </div>
              
              <div>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <p className="text-muted-foreground">
              Preferences settings will be available soon.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <p className="text-muted-foreground">
              Notification settings will be available soon.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Password</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Last changed: Never
                </p>
                <Button variant="outline" asChild>
                  <Link href="/forgot-password">Change Password</Link>
                </Button>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-1">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Enhance your account security with two-factor authentication.
                </p>
                <Button variant="outline" disabled>
                  Set Up 2FA (Coming Soon)
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}