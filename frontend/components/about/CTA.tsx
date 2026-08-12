import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-6 py-32">

      <div className="mx-auto max-w-5xl rounded-3xl border border-blue-600 bg-[#111827] p-16 text-center shadow-[0_0_50px_rgba(37,99,235,.25)]">

        <h2 className="text-5xl font-bold">
          Ready to Build Your Startup?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Join thousands of founders using Artificial Intelligence to validate
          ideas, build products and launch businesses faster.
        </p>

        <Link
          href="/signup"
          className="mt-10 inline-block rounded-xl bg-blue-600 px-10 py-4 font-semibold transition hover:bg-blue-500"
        >
          Get Started Free →
        </Link>

      </div>

    </section>
  );
}