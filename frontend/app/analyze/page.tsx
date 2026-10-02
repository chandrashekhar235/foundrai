"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";

type KnowledgeItem = {
  type: string;
  text: string;
  similarity: number;
};

type AnalysisResult = {
  startup: {
    startupName: string;
    idea: string;
    industry: string;
    targetCustomer: string;
    location: string;
    problem: string;
    solution: string;
    businessModel: string;
  };
  classification: string;
  retrieved_knowledge: KnowledgeItem[];
};

export default function AnalyzePage() {
  const [formData, setFormData] = useState({
    startupName: "",
    idea: "",
    industry: "",
    targetCustomer: "",
    location: "",
    problem: "",
    solution: "",
    businessModel: "",
  });

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:5001/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      console.log("FoundrAI Result:", data);

      setResult(data.data);
    } catch (error) {
      console.error("Error analyzing startup:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0A0A0A] px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl">

          {/* Heading */}

          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-500">
              FoundrAI Analysis
            </p>

            <h1 className="text-5xl font-extrabold tracking-tight">
              Tell us about your startup
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
              Provide some information about your startup idea.
              FoundrAI will use this information to generate your
              startup analysis.
            </p>
          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-3xl border border-zinc-800 bg-[#111827] p-8"
          >

            {/* Startup Name */}

            <div>
              <label className="mb-2 block font-semibold">
                Startup Name
              </label>

              <input
                type="text"
                name="startupName"
                value={formData.startupName}
                onChange={handleChange}
                placeholder="e.g. FoundrAI"
                className="w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                required
              />
            </div>

            {/* Startup Idea */}

            <div>
              <label className="mb-2 block font-semibold">
                Describe your startup idea
              </label>

              <textarea
                name="idea"
                value={formData.idea}
                onChange={handleChange}
                placeholder="What does your startup do?"
                rows={5}
                className="w-full resize-none rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                required
              />
            </div>

            {/* Industry */}

            <div>
              <label className="mb-2 block font-semibold">
                Industry
              </label>

              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
                required
              >
                <option value="">
                  Select industry
                </option>

                <option value="technology">
                  Technology
                </option>

                <option value="fintech">
                  FinTech
                </option>

                <option value="healthcare">
                  Healthcare
                </option>

                <option value="education">
                  Education
                </option>

                <option value="ecommerce">
                  E-Commerce
                </option>

                <option value="saas">
                  SaaS
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            {/* Target Customer */}

            <div>
              <label className="mb-2 block font-semibold">
                Target Customer
              </label>

              <input
                type="text"
                name="targetCustomer"
                value={formData.targetCustomer}
                onChange={handleChange}
                placeholder="Who will use your product?"
                className="w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Location */}

            <div>
              <label className="mb-2 block font-semibold">
                Target Market / Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. India, USA, Global"
                className="w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Problem */}

            <div>
              <label className="mb-2 block font-semibold">
                What problem are you solving?
              </label>

              <textarea
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                placeholder="Describe the problem your customers face..."
                rows={4}
                className="w-full resize-none rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Solution */}

            <div>
              <label className="mb-2 block font-semibold">
                What is your solution?
              </label>

              <textarea
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                placeholder="How does your product solve this problem?"
                rows={4}
                className="w-full resize-none rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Business Model */}

            <div>
              <label className="mb-2 block font-semibold">
                How will you make money?
              </label>

              <textarea
                name="businessModel"
                value={formData.businessModel}
                onChange={handleChange}
                placeholder="e.g. Subscription, commission, one-time purchase..."
                rows={3}
                className="w-full resize-none rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Error */}

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Analyzing your startup..."
                : "Analyze My Startup →"}
            </button>

          </form>

          {/* ========================= */}
          {/* ANALYSIS RESULT */}
          {/* ========================= */}

          {result && (
            <section className="mt-12 space-y-6">

              {/* Result Header */}

              <div className="rounded-3xl border border-zinc-800 bg-[#111827] p-8">

                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-500">
                  FoundrAI Analysis
                </p>

                <h2 className="text-4xl font-bold">
                  {result.startup.startupName}
                </h2>

                <p className="mt-3 text-zinc-400">
                  Here is the initial analysis generated from
                  your startup information.
                </p>

              </div>

              {/* Classification */}

              <div className="rounded-3xl border border-zinc-800 bg-[#111827] p-8">

                <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                  Startup Classification
                </p>

                <div className="mt-4 flex items-center justify-between">

                  <h3 className="text-2xl font-bold">
                    Business Type
                  </h3>

                  <span className="rounded-full bg-blue-500/10 px-5 py-2 text-lg font-bold text-blue-400">
                    {result.classification}
                  </span>

                </div>

              </div>

              {/* Knowledge */}

              <div className="rounded-3xl border border-zinc-800 bg-[#111827] p-8">

                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                    Knowledge Base Insights
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    Relevant Market & Competitor Information
                  </h3>
                </div>

                <div className="space-y-4">

                  {result.retrieved_knowledge.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5"
                      >

                        <div className="flex items-center justify-between">

                          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-400">
                            {item.type}
                          </span>

                          <span className="text-sm text-zinc-500">
                            Similarity:{" "}
                            {item.similarity.toFixed(2)}
                          </span>

                        </div>

                        <p className="mt-4 leading-7 text-zinc-300">
                          {item.text}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* Startup Summary */}

              <div className="rounded-3xl border border-zinc-800 bg-[#111827] p-8">

                <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                  Startup Summary
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">

                  <div className="rounded-xl bg-[#0A0A0A] p-4">
                    <p className="text-sm text-zinc-500">
                      Industry
                    </p>
                    <p className="mt-1 font-semibold">
                      {result.startup.industry}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0A0A0A] p-4">
                    <p className="text-sm text-zinc-500">
                      Target Customer
                    </p>
                    <p className="mt-1 font-semibold">
                      {result.startup.targetCustomer}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0A0A0A] p-4">
                    <p className="text-sm text-zinc-500">
                      Location
                    </p>
                    <p className="mt-1 font-semibold">
                      {result.startup.location}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0A0A0A] p-4">
                    <p className="text-sm text-zinc-500">
                      Business Model
                    </p>
                    <p className="mt-1 font-semibold">
                      {result.startup.businessModel}
                    </p>
                  </div>

                </div>

              </div>

            </section>
          )}

        </div>
      </main>
    </>
  );
}