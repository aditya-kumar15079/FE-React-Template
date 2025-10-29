import { useState, useCallback, useEffect } from "react";
import { BASE_URL, BASE_URL_COMMONTAG } from "../utils/Constants";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const GET = useCallback(async (endpoint, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${BASE_URL}${endpoint}?${query}`, {
        method: "GET",
      });
      // if (!response.ok) throw new Error(`GET ${endpoint} failed`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  // POST request
  const POST = useCallback(async (endpoint, body = {}, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(
        `${BASE_URL}${endpoint}${query ? "?" + query : ""}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(body),
        }
      );
      // if (!response.ok) throw new Error(`POST ${endpoint} failed`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { GET, POST, loading, error };
};

export default useApi;
