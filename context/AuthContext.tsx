"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/types";
import { getCurrentUser, signInAccount, signOutAccount } from "@/lib/auth";
import { useRouter } from "next/navigation";

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
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const checkAuthUser = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();

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
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInAccount({ email, password });
      const isUserAuthenticated = await checkAuthUser();

      if (isUserAuthenticated) {
        router.push("/dashboard");
      } else {
        throw new Error("Sign in failed");
      }
    } catch (error) {
      console.error(error);
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
      router.push("/");
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
    setUser,
    setIsAuthenticated,
    checkAuthUser,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);