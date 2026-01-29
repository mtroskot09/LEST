import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, InsertUser } from "@/lib/types";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = "lest_auth_user";

// Get user from localStorage on initial load
function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    const user = stored ? JSON.parse(stored) : null;
    console.log('[AUTH] getStoredUser:', user, 'from origin:', window.location.origin);
    return user;
  } catch (error) {
    console.error('[AUTH] getStoredUser error:', error);
    return null;
  }
}

// Save user to localStorage
function saveUserToStorage(user: User | null) {
  console.log('[AUTH] saveUserToStorage:', user, 'on origin:', window.location.origin);
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      const verify = localStorage.getItem(AUTH_STORAGE_KEY);
      console.log('[AUTH] Saved to localStorage, verified:', verify ? 'SUCCESS' : 'FAILED');
      console.log('[AUTH] All localStorage keys:', Object.keys(localStorage));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      console.log('[AUTH] Removed from localStorage');
    }
  } catch (error) {
    console.error('[AUTH] saveUserToStorage error:', error);
    // If localStorage is full or blocked, try sessionStorage as fallback
    if (user) {
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        console.log('[AUTH] Fallback: Saved to sessionStorage');
      } catch (e) {
        console.error('[AUTH] sessionStorage also failed:', e);
      }
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Initialize with stored user for immediate UI update
  const [storedUser, setStoredUser] = useState<User | null>(getStoredUser());
  
  console.log('[AUTH] AuthProvider initialized, storedUser:', storedUser);
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | undefined, Error>({
    queryKey: ["/api/user"],
    retry: false,
    // Use stored user as initial data for immediate UI
    initialData: storedUser || undefined,
    // Always run query, but check localStorage inside
    queryFn: async () => {
      console.log('[AUTH] queryFn: Starting /api/user query');
      try {
        // Read directly from localStorage to avoid state timing issues
        const currentStoredUser = getStoredUser();
        console.log('[AUTH] queryFn: currentStoredUser from localStorage:', currentStoredUser);
        
        // If no stored user, return null (not authenticated)
        if (!currentStoredUser) {
          console.log('[AUTH] queryFn: No stored user, returning null');
          return null;
        }
        
        const companyId = currentStoredUser.id;
        const headers: Record<string, string> = {
          "X-Company-ID": companyId,
        };
        console.log('[AUTH] queryFn: Fetching /api/user with headers:', headers);

        const res = await fetch("/api/user", {
          headers,
          credentials: "include",
        });
        
        console.log('[AUTH] queryFn: Response status:', res.status);
        
        if (res.status === 401) {
          console.log('[AUTH] queryFn: 401 Unauthorized, clearing storage');
          // Session invalid, clear localStorage
          saveUserToStorage(null);
          setStoredUser(null);
          return null;
        }
        
        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        
        const userData = await res.json();
        console.log('[AUTH] queryFn: User data received:', userData);
        // Update stored user with fresh data
        saveUserToStorage(userData);
        setStoredUser(userData);
        return userData;
      } catch (error) {
        console.error('[AUTH] queryFn: Error:', error);
        // If it's a 401 or network error, clear stored user
        if (error instanceof Error && (error.message.includes("401") || error.message.includes("Failed to fetch"))) {
          console.log('[AUTH] queryFn: Clearing storage due to error');
          saveUserToStorage(null);
          setStoredUser(null);
          return null;
        }
        throw error;
      }
    },
  });
  
  console.log('[AUTH] AuthProvider state - user:', user, 'isLoading:', isLoading, 'error:', error);
  
  // Sync user to localStorage whenever it changes
  useEffect(() => {
    console.log('[AUTH] useEffect: user changed:', user, 'storedUser:', storedUser);
    if (user) {
      saveUserToStorage(user);
      setStoredUser(user);
    } else if (user === null && storedUser) {
      // User was logged out, clear storage
      console.log('[AUTH] useEffect: User logged out, clearing storage');
      saveUserToStorage(null);
      setStoredUser(null);
    }
  }, [user, storedUser]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log('[AUTH] loginMutation: Starting login with credentials:', credentials);
      const res = await apiRequest("POST", "/api/login", credentials);
      const userData = await res.json();
      console.log('[AUTH] loginMutation: Login successful, user data:', userData);
      return userData;
    },
    onSuccess: async (user: User) => {
      console.log('[AUTH] loginMutation onSuccess: Saving user:', user);
      console.log('[AUTH] loginMutation onSuccess: Current origin:', window.location.origin);
      // Save to localStorage immediately - this is critical
      saveUserToStorage(user);
      setStoredUser(user);
      // Update React Query cache
      queryClient.setQueryData(["/api/user"], user);
      
      // Verify it was saved
      const verify = localStorage.getItem(AUTH_STORAGE_KEY);
      console.log('[AUTH] loginMutation onSuccess: Verification - localStorage has user:', !!verify);
      
      if (!verify) {
        console.error('[AUTH] loginMutation onSuccess: ERROR - User not saved to localStorage!');
        toast({
          title: 'Warning',
          description: 'Failed to save login state. Please try again.',
          variant: "destructive",
        });
        return;
      }
      
      console.log('[AUTH] loginMutation onSuccess: User saved successfully, redirecting to /schedule');
      // Use window.location.replace to avoid back button issues
      window.location.replace("/schedule");
    },
    onError: (error: Error) => {
      console.error('[AUTH] loginMutation onError:', error);
      toast({
        title: t.messages.loginFailed,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      // Clear localStorage
      saveUserToStorage(null);
      setStoredUser(null);
      queryClient.setQueryData(["/api/user"], null);
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: t.messages.logoutFailed,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
