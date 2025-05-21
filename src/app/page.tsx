import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// import { ThemeToggle } from "@/components/theme-toggle"; // Optional dark/light toggle
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text mb-5 p-2 text-transparent">
          AI-Powered PDF Chat & Knowledge Assistant
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl capitalize">
          Upload your documents and start asking questions. Get instant,
          intelligent answers with source references.
        </p>
        <Link href="/upload">
          <Button
            size="lg"
            className="bg-primary text-white px-4 py-2 rounded shadow-md hover:shadow-lg transition"
          >
            Get Started
          </Button>
          <div className="h-[2px] " />
        </Link>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-12 px-6">
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Smart Search",
              desc: "Retrieve accurate answers with contextual understanding using LLM + Vector Search.",
            },
            {
              title: "Source References",
              desc: "Every response is backed by citations and document sources you can trust.",
            },
            {
              title: "Simple Interface",
              desc: "Modern, clean chat UI with syntax highlighting, markdown rendering, and code blocks.",
            },
          ].map((feature, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-4 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AskIT. Built with Next.js, ShadCN, and
        OpenAI.
      </footer>
    </main>
  );
}
