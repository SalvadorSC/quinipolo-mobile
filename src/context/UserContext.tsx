import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import * as storage from '../utils/storage';
import { supabase } from '../services/supabaseClient';
import { getUserProfile } from '../services/api';

// Define a type for Leagues (kept for backwards compatibility, but not used)
type Leagues = {
  leagueId: string;
  moderatorArray: string[];
  leagueName: string;
  participants: string[];
  leagueImage: string;
};

// Define a type for your context state
export type UserDataType = {
  role: string;
  leagues: string[]; // Array of league IDs (strings)
  quinipolosToAnswer: any[];
  userId: string;
  userLeagues: Array<{ league_id: string; role: string }>;
  emailAddress: string;
  username: string;
  hasBeenChecked: boolean;
  stripeCustomerId?: string;
  isPro?: boolean;
  productId?: string;
  isAuthenticated: boolean;
  authInitialized?: boolean;
};

// Define a type for the context value
type UserContextType = {
  userData: UserDataType;
  updateUser: (newData: Partial<UserDataType>) => void;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
};

// Create a context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define a type for the provider props
type UserProviderProps = {
  children: ReactNode;
};

// Secure storage keys
const STORAGE_KEYS = {
  USER_ID: 'quinipolo-user-id',
  USERNAME: 'quinipolo-username',
  EMAIL: 'quinipolo-email',
  IS_AUTHENTICATED: 'quinipolo-is-authenticated',
};

// Export the provider as a named export
export const UserProvider = ({ children }: UserProviderProps) => {
  const [userData, setUserData] = useState<UserDataType>({
    role: '',
    leagues: [],
    quinipolosToAnswer: [],
    userId: '',
    userLeagues: [],
    emailAddress: '',
    username: '',
    hasBeenChecked: false,
    isAuthenticated: false,
    authInitialized: false,
  });

  // Initialize user data from secure storage and check for active session
  useEffect(() => {
    let isMounted = true;

    const initializeUserData = async () => {
      try {
        // Check for active Supabase session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('[UserContext] Init - Supabase session:', session ? 'exists' : 'null');
        if (sessionError) {
          console.error('[UserContext] Session error:', sessionError);
        }
        
        if (!isMounted) return;

        if (session?.user) {
          // User has an active session, fetch profile data
          try {
            const userProfile = await getUserProfile();
            if (!isMounted) return;
            
            setUserData((prev) => ({
              ...prev,
              userId: session.user.id,
              username: userProfile.username || session.user.email || '',
              emailAddress: userProfile.emailAddress || session.user.email || '',
              role: userProfile.role || '',
              leagues: userProfile.leagues || [],
              userLeagues: userProfile.userLeagues || [],
              isAuthenticated: true,
              authInitialized: true,
            }));
          } catch (profileError: any) {
            // If profile fetch fails, use session data
            console.error('[UserContext] Error fetching user profile on init:', profileError);
            if (!isMounted) return;
            
            setUserData((prev) => ({
              ...prev,
              userId: session.user.id,
              username: session.user.email || '',
              emailAddress: session.user.email || '',
              isAuthenticated: true,
              authInitialized: true,
            }));
          }
        } else {
          // No active session - clear any stale stored data
          console.log('[UserContext] No active session, clearing stored auth data');
          await Promise.all([
            storage.deleteItemAsync(STORAGE_KEYS.USER_ID),
            storage.deleteItemAsync(STORAGE_KEYS.USERNAME),
            storage.deleteItemAsync(STORAGE_KEYS.EMAIL),
            storage.deleteItemAsync(STORAGE_KEYS.IS_AUTHENTICATED),
          ]);
          
          if (!isMounted) return;
          setUserData((prev) => ({
            ...prev,
            userId: '',
            username: '',
            emailAddress: '',
            isAuthenticated: false,
            authInitialized: true,
          }));
        }
      } catch (error) {
        console.error('[UserContext] Error initializing user data:', error);
        if (!isMounted) return;
        setUserData((prev) => ({ ...prev, authInitialized: true, isAuthenticated: false }));
      }
    };

    initializeUserData();

    // Subscribe to auth state changes (like the frontend does)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[UserContext] Auth state changed:', event, session ? 'session exists' : 'no session');
        
        if (!isMounted) return;

        const userId = session?.user?.id ?? '';
        
        if (session?.user) {
          // User signed in or session restored
          try {
            // Update storage
            await Promise.all([
              storage.setItemAsync(STORAGE_KEYS.USER_ID, userId),
              storage.setItemAsync(STORAGE_KEYS.USERNAME, session.user.email || ''),
              storage.setItemAsync(STORAGE_KEYS.EMAIL, session.user.email || ''),
              storage.setItemAsync(STORAGE_KEYS.IS_AUTHENTICATED, 'true'),
            ]);

            // Always try to fetch profile to ensure we have latest data
            try {
              const userProfile = await getUserProfile();
              setUserData((prev) => ({
                ...prev,
                userId,
                username: userProfile.username || session.user.email || '',
                emailAddress: userProfile.emailAddress || session.user.email || '',
                role: userProfile.role || prev.role,
                leagues: userProfile.leagues || prev.leagues,
                userLeagues: userProfile.userLeagues || prev.userLeagues,
                isAuthenticated: true,
                authInitialized: true,
              }));
            } catch (profileError) {
              console.error('[UserContext] Error fetching profile on auth change:', profileError);
              // If profile fetch fails, at least set basic session data
              setUserData((prev) => ({
                ...prev,
                userId,
                username: session.user.email || prev.username || '',
                emailAddress: session.user.email || prev.emailAddress || '',
                isAuthenticated: true,
                authInitialized: true,
              }));
            }
          } catch (error) {
            console.error('[UserContext] Error updating auth state:', error);
          }
        } else {
          // User signed out
          await Promise.all([
            storage.deleteItemAsync(STORAGE_KEYS.USER_ID),
            storage.deleteItemAsync(STORAGE_KEYS.USERNAME),
            storage.deleteItemAsync(STORAGE_KEYS.EMAIL),
            storage.deleteItemAsync(STORAGE_KEYS.IS_AUTHENTICATED),
          ]);
          
          setUserData((prev) => ({
            ...prev,
            userId: '',
            username: '',
            emailAddress: '',
            isAuthenticated: false,
            authInitialized: true,
          }));
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const updateUser = useCallback(async (newData: Partial<UserDataType>) => {
    setUserData((prevData) => {
      const merged = { ...prevData, ...newData };
      // Only update if something actually changed
      const changed = Object.keys(newData).some(
        (key) =>
          merged[key as keyof UserDataType] !==
          prevData[key as keyof UserDataType]
      );
      if (changed) {
        // Update secure storage for specific fields
        const storageUpdates: Promise<void>[] = [];
        if (newData.userId) {
          storageUpdates.push(
            storage.setItemAsync(STORAGE_KEYS.USER_ID, newData.userId)
          );
        }
        if (newData.username) {
          storageUpdates.push(
            storage.setItemAsync(STORAGE_KEYS.USERNAME, newData.username)
          );
        }
        if (newData.emailAddress) {
          storageUpdates.push(
            storage.setItemAsync(STORAGE_KEYS.EMAIL, newData.emailAddress)
          );
        }
        if (newData.isAuthenticated !== undefined) {
          storageUpdates.push(
            storage.setItemAsync(
              STORAGE_KEYS.IS_AUTHENTICATED,
              newData.isAuthenticated.toString()
            )
          );
        }

        // Execute storage updates
        Promise.all(storageUpdates).catch((error) => {
          console.error('Error updating secure storage:', error);
        });

        return merged;
      }
      return prevData;
    });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear secure storage
      await Promise.all([
        storage.deleteItemAsync(STORAGE_KEYS.USER_ID),
        storage.deleteItemAsync(STORAGE_KEYS.USERNAME),
        storage.deleteItemAsync(STORAGE_KEYS.EMAIL),
        storage.deleteItemAsync(STORAGE_KEYS.IS_AUTHENTICATED),
      ]);

      // Clear user data
      setUserData({
        role: '',
        leagues: [],
        quinipolosToAnswer: [],
        userId: '',
        userLeagues: [],
        emailAddress: '',
        username: '',
        hasBeenChecked: false,
        isAuthenticated: false,
        authInitialized: true,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Refresh user data from your API here
        // This is a placeholder - implement based on your API
        console.log('User data refreshed:', user);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }, []);

  const value: UserContextType = {
    userData,
    updateUser,
    signOut,
    refreshUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
