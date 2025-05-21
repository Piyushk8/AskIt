import { useJobStatus } from "./userJobStatus";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export function JobStatusIndicator({ jobId }: { jobId: string | null }) {
  const { status, isDone, error } = useJobStatus(jobId);

  if (!jobId) return null;

  return (
    <div className="flex items-center gap-2 p-3 border rounded bg-card">
      {error ? (
        <>
          <AlertTriangle className="text-red-500 h-5 w-5" />
          <span className="text-red-600">{error}</span>
        </>
      ) : isDone ? (
        <>
          <CheckCircle2 className="text-green-500 h-5 w-5" />
          <span className="text-green-700">File processed! Start chatting.</span>
        </>
      ) : (
        <>
          <Loader2 className="animate-spin text-blue-500 h-5 w-5" />
          <span className="text-blue-600">Processing file... (status: {status})</span>
        </>
      )}
    </div>
  );
}
