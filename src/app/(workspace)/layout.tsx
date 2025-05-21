import ChatList from "@/components/ChatList";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh_-_5rem)]">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-secondary text-primary p-4 flex flex-col gap-4">
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 p-2 bg-card border border-border rounded text-primary hover:bg-secondary hover:text-card-foreground transition"
        >
          <PlusIcon className="h-4 w-4" />
          <span>New Chat</span>
        </Link>

        <ChatList />
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-background p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
