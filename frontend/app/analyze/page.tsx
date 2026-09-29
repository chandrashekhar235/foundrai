"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";

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

    try {
        const response = await fetch("http://localhost:5000/api/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        console.log("Analysis response:", data);
    } catch (error) {
        console.error("Error:", error);
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


            {/* Submit */}

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold transition hover:bg-blue-500"
            >
              Analyze My Startup →
            </button>

          </form>

        </div>

      </main>
    </>
  );
}