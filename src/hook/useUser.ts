"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  name?: string;
  email?: string;
  photo?: string;
  role?: "user" | "admin";
  mobileNumber?: string;
  wishList?: string[];
  fullAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const useUser = (): UseUserReturn => {
  const { data: session, status } = useSession();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      if (status !== "loading") setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/users/${userId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, status]);

  return { user, isLoading, error };
};

export default useUser;

// const { user, isLoading, error } = useUser()
