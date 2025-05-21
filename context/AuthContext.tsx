"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/types";
import { getCurrentUser, signInAccount, signOutAccount, requestPasswordReset, resetPassword, saveUserToDB } from "@/lib/auth";
import { isRateLimited, getRateLimitWaitTime } from "@/lib/rate-limit";
import { useRouter } from "next/navigation";
import { account, avatars } from "@/lib/appwrite";
import Cookies from 'js-cookie';

export const INITIAL_USER = {
  $id: "",
  name: "",
  email: "",
  imageUrl: "",
};

type AuthContextType = {
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  isRateLimited: boolean;
  rateLimitWaitTime: number;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  completePasswordReset: (
    userId: string,
    secret: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  isRateLimited: false,
  rateLimitWaitTime: 0,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
  signIn: async () => {},
  signOut: async () => {},
  forgotPassword: async () => {},
  completePasswordReset: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rateLimitStatus, setRateLimitStatus] = useState({
    isLimited: false,
    waitTime: 0
  });
  const router = useRouter();
  
  // Check rate limit status periodically
  useEffect(() => {
    const checkRateLimit = () => {
      const isLimited = isRateLimited();
      const waitTime = getRateLimitWaitTime();
      
      setRateLimitStatus({
        isLimited,
        waitTime
      });
    };
    
    // Check immediately
    checkRateLimit();
    
    // Then check every 5 seconds
    const interval = setInterval(checkRateLimit, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const checkAuthUser = async () => {
    try {
      setIsLoading(true);
      console.log("Checking authentication status...");
      
      const currentUser = await getCurrentUser();
      console.log("Current user:", currentUser);

      if (currentUser) {
        setUser({
          $id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
          imageUrl: currentUser.imageUrl,
          username: currentUser.username,
          bio: currentUser.bio,
        });
        setIsAuthenticated(true);
        
        // Set username cookie for middleware route protection
        if (currentUser.username) {
          Cookies.set('user-username', currentUser.username, { 
            expires: 7, // 7 days
            path: '/',
            sameSite: 'strict'
          });
        }
        
        return true;
      }

      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      // Remove cookies when user is not authenticated
      Cookies.remove('user-username');
      return false;
    } catch (error) {
      console.error("Error checking auth user:", error);
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      // Remove cookies on error
      Cookies.remove('user-username');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Starting sign in process for:", email);
      
      // Check if already authenticated with the same email
      if (isAuthenticated && user.email === email) {
        console.log("User already authenticated with the same email");
        return; // Don't redirect here, let the component handle it
      }
      
      try {
        // Create email session
        const session = await signInAccount({ email, password });
        console.log("Session created:", session);
        
        // Add a delay to allow database operations to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check user authentication
        const isUserAuthenticated = await checkAuthUser();
        console.log("Authentication check result:", isUserAuthenticated);
  
        if (!isUserAuthenticated) {
          console.log("Authentication check failed, trying to create profile...");
          try {
            // Fetch current account 
            const currentAccount = await account.get();
            
            if (currentAccount) {
              // Create user profile if it doesn't exist
              const avatarUrl = avatars.getInitials(currentAccount.name);
              
              await saveUserToDB({
                $id: currentAccount.$id,
                name: currentAccount.name,
                email: currentAccount.email,
                imageUrl: avatarUrl,
                username: currentAccount.email.split('@')[0],
              });
              
              // Try authenticating again
              await checkAuthUser();
            }
          } catch (profileError) {
            console.error("Failed to create profile:", profileError);
            throw new Error("Sign in failed - could not authenticate user");
          }
        }
      } catch (sessionError: any) {
        console.error("Session creation error:", sessionError);
        throw sessionError;
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await signOutAccount();
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      
      // Remove cookies on sign out
      Cookies.remove('user-username');
      
      router.push("/");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await requestPasswordReset(email);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completePasswordReset = async (
    userId: string,
    secret: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      setIsLoading(true);
      await resetPassword(userId, secret, password, confirmPassword);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated on page load
    checkAuthUser();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isRateLimited: rateLimitStatus.isLimited,
    rateLimitWaitTime: rateLimitStatus.waitTime,
    setUser,
    setIsAuthenticated,
    checkAuthUser,
    signIn,
    signOut,
    forgotPassword,
    completePasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);