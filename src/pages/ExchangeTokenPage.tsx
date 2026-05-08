import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ExchangeTokenPage() {
  const { isAuthenticated, isLoading, completeLogin } = useAuth();
  const navigate = useNavigate();
  const hasExchangedRef = useRef(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code) {
      navigate("/", { replace: true });
      return;
    }

    if (hasExchangedRef.current) {
      return;
    }
    hasExchangedRef.current = true;

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const callbackPath =
      import.meta.env.VITE_AUTH_CALLBACK_PATH || "/api/auth/callback";
    const legacyCallbackPath = "/api/strava/callback";

    const query = new URLSearchParams({ code });
    if (state) {
      query.set("state", state);
    }

    const exchange = async (path: string) => {
      const response = await fetch(`${baseUrl}${path}?${query.toString()}`);

      if (!response.ok) {
        throw new Error(`Token exchange failed with status ${response.status}`);
      }

      return response.json();
    };

    let isActive = true;

    const exchangeToken = async () => {
      try {
        const data = await exchange(callbackPath);

        if (!isActive) {
          return;
        }

        const token = data.access_token ?? data.token;
        const athlete = data.athlete ?? data.user ?? data.profile;

        if (token && athlete) {
          completeLogin(token, athlete);
          navigate("/dashboard", { replace: true });
          return;
        }

        navigate("/", { replace: true });
      } catch (error) {
        try {
          const fallbackData = await exchange(legacyCallbackPath);

          if (!isActive) {
            return;
          }

          const token = fallbackData.access_token ?? fallbackData.token;
          const athlete =
            fallbackData.athlete ?? fallbackData.user ?? fallbackData.profile;

          if (token && athlete) {
            completeLogin(token, athlete);
            navigate("/dashboard", { replace: true });
            return;
          }

          navigate("/", { replace: true });
        } catch (fallbackError) {
          console.error("Token exchange failed:", error);
          console.error("Legacy callback fallback also failed:", fallbackError);

          if (isActive) {
            navigate("/", { replace: true });
          }
        }
      }
    };

    exchangeToken();

    return () => {
      isActive = false;
    };
  }, [completeLogin, isAuthenticated, isLoading, navigate]);

  return (
    <div>
      <p>Connecting your account...</p>
    </div>
  );
}

export default ExchangeTokenPage;