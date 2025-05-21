"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { server } from "@/lib/utils";
// Note: Changed import from CJS to ESM for better tree-shaking

// Define our message type for better type safety
interface Source {
  content: string;
  metadata: {
    source: string;
    loc?: {
      pageNumber?: number;
    };
  };
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  sources?: Source[];
}

export default function ChatPage() {
  const params = useParams();
  const sessionId = params?.sessionId;
  const router = useRouter();
  const [sessionStatus, setSessionStatus] = useState<
    "pending" | "waiting" | "notFound" | "completed"|"active"
  >("pending");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const checkJobStatus = async () => {
      try {
        const response = await axios.get(
          `${server}/job/status/${sessionId}`
        );
        console.log(response);

        const { status } = response.data;

        if (status === "completed") {
          setSessionStatus("completed");
        } else if (status === "notFound") {
          setSessionStatus("notFound");
        } else {
          setSessionStatus("waiting");
        }
      } catch (error) {
        console.error("Error checking status:", error);
        setSessionStatus("notFound");
      }
    };

    // Poll every 2.5 seconds
    const interval = setInterval(checkJobStatus, 10000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const input = inputRef.current?.value;

    if (!input?.trim()) return;

    // Clear input field
    if (inputRef.current) inputRef.current.value = "";

    // Add user message to state
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<ApiResponse>(
        `${server}/ask/${params.sessionId}`,
        {
          message: input,
        }
      );

      if (response.data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: response.data.message,
          sources: response.data.sources,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setError("Failed to get a response. Please try again.");
      }
    } catch (err) {
      console.error("Chat API error:", err);
      setError(
        "An error occurred while fetching the response. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Extract message component for better organization
  const MessageComponent = ({ message }: { message: Message }) => {
    const isUser = message.role === "user";

    return (
      <div
        className={`p-4 rounded-lg ${
          isUser
            ? "bg-blue-100 ml-auto max-w-[70%]"
            : "bg-gray-100 mr-auto max-w-[70%]"
        }`}
      >
        <div className="prose max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");

                if (match) {
                  return (
                    <SyntaxHighlighter
                      // Fixed TypeScript issue by using proper type for style
                      //@ts-ignore
                      style={materialDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ borderRadius: "8px", padding: "1em" }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  );
                }

                return (
                  <code
                    className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {message.role === "assistant" &&
          message.sources &&
          message.sources.length > 0 && (
            <SourcesSection sources={message.sources} />
          )}
      </div>
    );
  };

  // Extract sources component for better organization
  const SourcesSection = ({ sources }: { sources: Source[] }) => (
    <div className="mt-2 text-xs text-gray-600 border-t border-gray-200 pt-2">
      <details className="cursor-pointer">
        <summary className="font-medium">
          View sources ({sources.length})
        </summary>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          {sources.map((src, idx) => (
            <li key={idx} className="break-all">
              {src.metadata.loc?.pageNumber &&
                `Page ${src.metadata.loc.pageNumber} – `}
              {src.metadata.source.split("\\").pop()}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 ">
      {/* Chat messages container */}
      {sessionStatus !== "completed" ? (
        <div className="flex flex-col items-center justify-center h-full w-full ">
          {sessionStatus === "waiting" ||
            (sessionStatus === "pending" && (
              <div className="text-center text-xl text-gray-500  mt-10 flex flex-col items-center gap-2.5">
                <span className="text-primary">
                  Your document is being processed... Please wait....
                </span>
                <Loader2 className="size-10 text-primary animate-spin" />
              </div>
            ))}

          {sessionStatus === "notFound" && (
            <div className="text-center text-red-500 mt-10">
              We couldn't find this session. Please try again or re-upload your
              document.
              <Link
                href={"/upload"}
                className="border border-border text-primary bg-card hover:bg-primary hover:text-primary-foreground px-2 py-1"
              >
                Upload Again
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center my-8">
                Ask a question to start chatting with your documents
              </div>
            )}

            {messages.map((msg, i) => (
              <MessageComponent key={i} message={msg} />
            ))}

            {isLoading && (
              <div className="bg-gray-100 p-4 rounded-lg mr-auto max-w-[70%] animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mx-auto">
                {error}
              </div>
            )}

            {/* Empty div for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
            onSubmit={handleSubmit}
          >
            <input
              ref={inputRef}
              className="flex-1 p-3 focus:outline-none"
              placeholder="Ask about your documents..."
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium transition-colors disabled:bg-blue-400"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
