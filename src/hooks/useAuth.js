import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/auth/me", {
          credentials: "include", // important to send cookies
        });

        if (res.status === 401) {
          // Not logged in, redirect to auth service
          window.location.href = "/auth/login";
          return;
        }

        const data = await res.json();
        setUser(data.data || null); // user info returned by /me
      } catch (err) {
        console.error("Error fetching user:", err);
        window.location.href = "/auth/login";
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
