import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export function Profile() {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const API = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null);
        const token = await getAccessTokenSilently();
        console.log("TOKEN:", token);

        const res = await fetch(`${API}/me`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user?.email }),
        });

        console.log("API:", API);
        console.log("EMAIL:", user?.email);

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || data?.message || `HTTP ${res.status}`);

        setProfile(data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to fetch");
      }
    };

    if (isAuthenticated && user?.email) {
      fetchProfile();
    }
  }, [isAuthenticated, user?.email, getAccessTokenSilently]);

  return (
    <div>
      <h2>My Profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
}
