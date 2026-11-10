
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero-shell relative flex min-h-[75vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">

      {/* Background glow */}
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      {/* Subtle grid */}
      <div className="hero-grid absolute inset-0 -z-10 pointer-events-none" />

      {/* Badge */}
      <div className="hero-reveal hero-delay-1">
        <p className="rounded-full border border-blue-500/40 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400 backdrop-blur-md">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-blue-400" />
          AI-Powered Startup Validation
        </p>
      </div>

      {/* Main heading */}
      <h1 className="hero-reveal hero-delay-2 mt-10 max-w-5xl text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">

        Your AI Co-Founder for

        <span className="hero-gradient-text mt-2 block">
          Startup Success.
        </span>

      </h1>

      {/* Description */}
      <p className="hero-reveal hero-delay-3 mt-8 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
        Validate startup ideas using AI-powered market research,
        competitor analysis, customer insights and investor-ready
        reports.
      </p>

      {/* CTA Buttons */}
      <div className="hero-reveal hero-delay-4 mt-12 flex flex-col gap-5 sm:flex-row">

        <Link
          href="/dashboard"
          className="hero-button rounded-2xl bg-blue-600 px-9 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
        >
          Get Started
          <span className="ml-2">→</span>
        </Link>

        <button
          type="button"
          className="hero-button rounded-2xl border border-zinc-700 bg-white/[0.02] px-9 py-4 font-semibold text-white hover:border-blue-500 hover:bg-blue-500/5"
        >
          Watch Demo
        </button>

      </div>

    </section>
  );
}
