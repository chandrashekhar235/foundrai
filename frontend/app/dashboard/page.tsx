import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function DashboardPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0A0A0A] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-500">
              Founder Dashboard
            </p>

            <h1 className="text-5xl font-extrabold tracking-tight">
              Build your startup with AI.
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
              Analyze your startup idea, understand your market,
              study competitors and create a roadmap for launching.
            </p>
          </div>


          {/* Main Action */}
          <div className="mb-10 rounded-3xl border border-blue-500/30 bg-[#111827] p-8 shadow-[0_0_40px_rgba(37,99,235,0.12)]">

            <div className="max-w-2xl">

              <p className="mb-2 text-sm font-semibold text-blue-400">
                START HERE
              </p>

              <h2 className="text-3xl font-bold">
                Analyze your startup idea
              </h2>

              <p className="mt-3 leading-7 text-zinc-400">
                Tell FoundrAI about your startup and get an AI-powered
                analysis covering your market, customers, competitors,
                business model and growth strategy.
              </p>

              <Link
                href="/analyze"
                className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                Analyze My Startup →
              </Link>

            </div>

          </div>


          {/* Analysis Modules */}
          <div>

            <h2 className="mb-6 text-2xl font-bold">
              Startup Intelligence
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              <DashboardCard
                title="Market Research"
                description="Understand your target market, trends and opportunities."
              />

              <DashboardCard
                title="Competitors"
                description="Identify competitors and understand their positioning."
              />

              <DashboardCard
                title="Customer Personas"
                description="Discover who your ideal customers are."
              />

              <DashboardCard
                title="Business Model"
                description="Build a sustainable revenue and pricing strategy."
              />

            </div>

          </div>


          {/* Bottom section */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">

            <DashboardCard
              title="Financial Forecast"
              description="Estimate costs, revenue and startup economics."
            />

            <DashboardCard
              title="MVP Roadmap"
              description="Create milestones to turn your idea into a product."
            />

          </div>

        </div>
      </main>
    </>
  );
}


function DashboardCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111827] p-6 transition hover:-translate-y-1 hover:border-blue-500/50">
      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-zinc-400">
        {description}
      </p>
    </div>
  );
}