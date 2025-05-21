"use client"
import { useEffect, useState } from "react";

export function useJobStatus(jobId: string | null) {
  const [status, setStatus] = useState<"pending" | "completed" | "failed" | "not_found">("pending");
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/job-status/${jobId}`);
        if (!res.ok) throw new Error("Failed to fetch job status");

        const { status } = await res.json();
        setStatus(status);

        if (status === "completed") {
          clearInterval(interval);
          setIsDone(true);
        } else if (status === "failed" || status === "not_found") {
          clearInterval(interval);
          setError("Something went wrong.");
        }
      } catch (err) {
        console.error(err);
        clearInterval(interval);
        setError("Network error. Please try again.");
      }
    }, 3000); // check every 3 seconds

    return () => clearInterval(interval);
  }, [jobId]);

  return { status, isDone, error };
}
