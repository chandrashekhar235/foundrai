import Link from "next/link";
export default function Hero() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">

      <p className="rounded-full border border-blue-600/40 bg-blue-600/10 px-5 py-2 text-sm text-blue-400">
        AI-Powered Startup Validation
      </p>

      <h1 className="mt-8 max-w-5xl text-5xl font-extrabold leading-tight md:text-7xl">
        Your AI Co-Founder for
        <span className="text-blue-600"> Startup Success.</span>
      </h1>

      <p className="mt-8 max-w-3xl text-lg text-zinc-400">
        Validate startup ideas using AI-powered market research,
        competitor analysis, customer insights and investor-ready
        reports.
      </p>

      <div className="mt-12 flex flex-col gap-5 sm:flex-row">

        <button className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-700 transition">
        <Link href="/dashboard">
        Get Started 
        </Link>
        </button>

        <button className="rounded-2xl border border-zinc-700 px-8 py-4 hover:bg-zinc-900 transition">
          Watch Demo
        </button>

      </div>

    </section>
  );
}