import { createContext, useContext, useEffect, useState } from "react";

// --- Types ---
interface AppUser {
  id: number;
  firstname?: string;
  lastname?: string;
  profile?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface AuthState {
  accessToken: string | null;
  athlete: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  completeLogin: (accessToken: string, athlete: AppUser) => void;
}

const ACCESS_TOKEN_KEY = "fuelwise_access_token";
const ATHLETE_KEY = "fuelwise_user";
const LEGACY_ACCESS_TOKEN_KEY = "strava_access_token";
const LEGACY_ATHLETE_KEY = "strava_athlete";

// --- Context Creation ---
const AuthContext = createContext<AuthContextType | null>(null);

// --- Provider Component ---
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    athlete: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // --- Check for existing token on app load ---
  useEffect(() => {
    const devBypassAuth = import.meta.env.VITE_DEV_BYPASS_AUTH === "true";

    if (devBypassAuth) {
      setAuthState({
        accessToken: "dev-bypass-token",
        athlete: {
          id: 0,
          firstname: "Dev",
          lastname: "User",
          profile: "",
          city: "",
          state: "",
          country: "",
        },
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }

    const token =
      localStorage.getItem(ACCESS_TOKEN_KEY) ??
      localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY);
    const athlete =
      localStorage.getItem(ATHLETE_KEY) ??
      localStorage.getItem(LEGACY_ATHLETE_KEY);

    if (token && athlete) {
      setAuthState({
        accessToken: token,
        athlete: JSON.parse(athlete),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const completeLogin = (accessToken: string, athlete: AppUser) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(ATHLETE_KEY, JSON.stringify(athlete));

    // Keep legacy keys during migration so existing code paths keep working.
    localStorage.setItem(LEGACY_ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(LEGACY_ATHLETE_KEY, JSON.stringify(athlete));

    setAuthState({
      accessToken,
      athlete,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  // --- Login — redirect to external provider ---
  const login = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const authStartPath = import.meta.env.VITE_AUTH_START_PATH || "/api/auth/connect";
    const legacyAuthPath = "/api/strava/auth";

    const getAuthUrl = async (path: string) => {
      const response = await fetch(`${baseUrl}${path}`);

      if (!response.ok) {
        throw new Error(`Auth start failed with status ${response.status}`);
      }

      return response.json();
    };

    try {
      const data = await getAuthUrl(authStartPath);
      window.location.href = data.url;
    } catch (error) {
      try {
        const fallbackData = await getAuthUrl(legacyAuthPath);
        window.location.href = fallbackData.url;
      } catch (fallbackError) {
        console.error("Failed to get auth URL:", error);
        console.error("Legacy auth fallback also failed:", fallbackError);
      }
    }
  };

  // ---Logout - Clear token ---
  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(ATHLETE_KEY);
    localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
    localStorage.removeItem(LEGACY_ATHLETE_KEY);
    setAuthState({
      accessToken: null,
      athlete: null,
      isAuthenticated: false,
      isLoading: false,
    });
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, completeLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Custom Hook ---
// Use this in any component that needs auth state
// Example: const { isAuthenticated, athlete, login, logout } = useAuth()
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
