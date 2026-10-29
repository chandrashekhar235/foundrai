"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Navbar from "@/components/layout/Navbar";

type StartupData = {
  startupName?: string;
  idea?: string;
  industry?: string;
  targetCustomer?: string;
  location?: string;
  problem?: string;
  solution?: string;
  businessModel?: string;
  [key: string]: unknown;
};

type GenericRecord = Record<string, unknown>;

type KnowledgeItem = {
  type?: string;
  text?: string;
  similarity?: number;
  relevance_score?: number;
  source?: string;
};

type Recommendation = {
  title?: string;
  description?: string;
  priority?: string;
  timeline?: string;
  key_metrics?: string;
};

type RiskItem = {
  risk?: string;
  severity?: string;
  source?: string;
};

type AnalysisResult = {
  startup?: StartupData;
  startup_context?: GenericRecord;
  classification?: string | null;
  classification_confidence?: number | null;
  classification_confidence_label?: string | null;
  market_analysis?: GenericRecord | null;
  competitor_analysis?: GenericRecord[];
  business_model_fit?: GenericRecord | null;
  risk_assessment?: RiskItem[];
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: Recommendation[];
  knowledge_insights?: KnowledgeItem[];
  retrieved_knowledge?: KnowledgeItem[];
  planning_insights?: {
    customer_personas?: GenericRecord[];
    mvp_roadmap_templates?: GenericRecord[];
    launch_strategy_templates?: GenericRecord[];
    financial_assumptions?: GenericRecord[];
    data_notes?: Record<string, string>;
    [key: string]: unknown;
  };
  model_info?: GenericRecord;
  analysis_scope?: GenericRecord;
};

function humanize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.length
      ? value.map((entry) => formatValue(entry)).join(", ")
      : "Not provided";
  }

  if (typeof value === "object") {
    return (
      Object.entries(value as GenericRecord)
        .filter(
          ([, entry]) =>
            entry !== null && entry !== undefined && entry !== ""
        )
        .map(([key, entry]) => `${humanize(key)}: ${formatValue(entry)}`)
        .join(" · ") || "Not provided"
    );
  }

  return String(value);
}

function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-[#111827] p-6 sm:p-8">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
          {eyebrow}
        </p>
      )}

      <h3 className={`${eyebrow ? "mt-2" : ""} text-2xl font-bold`}>
        {title}
      </h3>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function RecordCards({
  records,
  emptyText,
}: {
  records?: GenericRecord[];
  emptyText: string;
}) {
  if (!records?.length) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-400">
        {emptyText}
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {records.map((record, index) => {
        const titleKeys = [
          "title",
          "name",
          "phase",
          "stage",
          "roadmap_name",
          "template_name",
          "strategy_name",
        ];

        const preferredTitle = titleKeys
          .map((key) => record[key])
          .find(
            (value) =>
              typeof value === "string" && value.trim().length > 0
          );

        const entries = Object.entries(record).filter(
          ([, value]) =>
            value !== null && value !== undefined && value !== ""
        );

        return (
          <article
            key={`${String(preferredTitle ?? "record")}-${index}`}
            className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5"
          >
            <h4 className="text-lg font-semibold text-white">
              {typeof preferredTitle === "string"
                ? preferredTitle
                : `Item ${index + 1}`}
            </h4>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {entries.map(([key, value]) => {
                if (
                  typeof preferredTitle === "string" &&
                  value === preferredTitle &&
                  titleKeys.includes(key)
                ) {
                  return null;
                }

                return (
                  <div
                    key={key}
                    className="min-w-0 rounded-xl bg-white/[0.03] p-3"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      {humanize(key)}
                    </p>

                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-200">
                      {formatValue(value)}
                    </p>
                  </div>
                );
              })}
            </div>
          </article>
        );
      })}
    </div>
  );
}

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
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

      const payload = data.data ?? data;

      if (!payload || typeof payload !== "object") {
        throw new Error(
          "The analysis service returned an invalid response."
        );
      }

      console.log("FoundrAI Result:", payload);
      setResult(payload as AnalysisResult);
    } catch (err) {
      console.error("Error analyzing startup:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const startup = result?.startup ?? {};
  const planning = result?.planning_insights;

  const knowledgeItems = result?.knowledge_insights?.length
    ? result.knowledge_insights
    : result?.retrieved_knowledge ?? [];

  const submittedValue = (key: keyof typeof formData) =>
    String(startup[key] ?? formData[key] ?? "");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0A0A0A] px-4 py-10 text-white sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          {/* Page heading */}

          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-500">
              FoundrAI Analysis
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Tell us about your startup
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
              Share your idea and business context to generate a
              structured preliminary analysis.
            </p>
          </div>

          {/* Startup form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-3xl border border-zinc-800 bg-[#111827] p-5 sm:p-8"
          >
            <div>
              <label
                htmlFor="startupName"
                className="mb-2 block font-semibold"
              >
                Startup Name
              </label>

              <input
                id="startupName"
                type="text"
                name="startupName"
                value={formData.startupName}
                onChange={handleChange}
                placeholder="e.g. CodePilot"
                minLength={2}
                className="w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="idea"
                className="mb-2 block font-semibold"
              >
                Describe your startup idea
              </label>

              <textarea
                id="idea"
                name="idea"
                value={formData.idea}
                onChange={handleChange}
                placeholder="What does your startup do?"
                rows={4}
                minLength={20}
                className="w-full resize-y rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="industry"
                className="mb-2 block font-semibold"
              >
                Industry
              </label>

              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
                required
              >
                <option value="">Select industry</option>
                <option value="technology">Technology</option>
                <option value="fintech">FinTech</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="saas">SaaS</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="targetCustomer"
                className="mb-2 block font-semibold"
              >
                Target Customer
              </label>

              <input
                id="targetCustomer"
                type="text"
                name="targetCustomer"
                value={formData.targetCustomer}
                onChange={handleChange}
                placeholder="Who will use your product?"
                minLength={5}
                className="w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-2 block font-semibold"
              >
                Target Market / Location
              </label>

              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. India, USA, Global"
                minLength={2}
                className="w-full rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="problem"
                className="mb-2 block font-semibold"
              >
                What problem are you solving?
              </label>

              <textarea
                id="problem"
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                placeholder="Describe the problem your customers face..."
                rows={4}
                minLength={10}
                className="w-full resize-y rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="solution"
                className="mb-2 block font-semibold"
              >
                What is your solution?
              </label>

              <textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                placeholder="How does your product solve this problem?"
                rows={4}
                minLength={10}
                className="w-full resize-y rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="businessModel"
                className="mb-2 block font-semibold"
              >
                How will you make money?
              </label>

              <textarea
                id="businessModel"
                name="businessModel"
                value={formData.businessModel}
                onChange={handleChange}
                placeholder="e.g. Freemium subscription, commission, one-time purchase..."
                rows={3}
                minLength={3}
                className="w-full resize-y rounded-xl border border-zinc-700 bg-[#0A0A0A] px-4 py-3 text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400"
              >
                {error}
              </div>
            )}

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

          {/* Analysis results */}

          {result && (
            <section
              className="mt-12 space-y-6"
              aria-live="polite"
            >
              {/* Main result */}

              <div className="rounded-3xl border border-zinc-800 bg-[#111827] p-6 sm:p-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-500">
                  FoundrAI Analysis
                </p>

                <h2 className="text-3xl font-bold sm:text-4xl">
                  {String(
                    startup.startupName ?? formData.startupName
                  )}
                </h2>

                <p className="mt-3 whitespace-pre-wrap leading-7 text-zinc-300">
                  {String(startup.idea ?? formData.idea)}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-blue-500/10 px-4 py-2 font-semibold text-blue-400">
                    {result.classification ??
                      "Classification unavailable"}
                  </span>

                  {typeof result.classification_confidence ===
                    "number" && (
                    <span className="text-sm text-zinc-400">
                      Model confidence:{" "}
                      {(
                        result.classification_confidence * 100
                      ).toFixed(1)}
                      %
                      {result.classification_confidence_label
                        ? ` · ${result.classification_confidence_label}`
                        : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Detailed startup summary */}

              <Panel
                title="Startup Summary"
                eyebrow="Your submitted idea"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Industry", submittedValue("industry")],
                    [
                      "Target customer",
                      submittedValue("targetCustomer"),
                    ],
                    [
                      "Target market / location",
                      submittedValue("location"),
                    ],
                    [
                      "Business model",
                      submittedValue("businessModel"),
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl bg-[#0A0A0A] p-4"
                    >
                      <p className="text-sm text-zinc-500">
                        {label}
                      </p>
                      <p className="mt-1 break-words font-semibold">
                        {value || "Not provided"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-4">
                  {[
                    [
                      "Problem",
                      submittedValue("problem"),
                    ],
                    [
                      "Proposed solution",
                      submittedValue("solution"),
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl bg-[#0A0A0A] p-4"
                    >
                      <p className="text-sm text-zinc-500">
                        {label}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap leading-7 text-zinc-200">
                        {value || "Not provided"}
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Market overview */}

              {result.market_analysis && (
                <Panel
                  title="Market Overview"
                  eyebrow="Knowledge-base context"
                >
                  <p className="leading-7 text-zinc-300">
                    {formatValue(
                      result.market_analysis.description
                    )}
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {[
                      "market_type",
                      "target_customers",
                      "common_problems",
                      "common_business_models",
                    ].map((key) => {
                      const value =
                        result.market_analysis?.[key];

                      if (
                        value === undefined ||
                        value === null ||
                        value === ""
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={key}
                          className="rounded-xl bg-[#0A0A0A] p-4"
                        >
                          <p className="text-sm text-zinc-500">
                            {humanize(key)}
                          </p>
                          <p className="mt-2 leading-6 text-zinc-200">
                            {formatValue(value)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-4 text-xs text-zinc-500">
                    This section uses the current knowledge base,
                    not live market research.
                  </p>
                </Panel>
              )}

              {/* Business model fit */}

              {result.business_model_fit && (
                <Panel
                  title="Business Model Assessment"
                  eyebrow="Revenue model"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(
                      result.business_model_fit
                    ).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-xl bg-[#0A0A0A] p-4"
                      >
                        <p className="text-sm text-zinc-500">
                          {humanize(key)}
                        </p>
                        <p className="mt-2 leading-6 text-zinc-200">
                          {formatValue(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </Panel>
              )}

              {/* Strengths and weaknesses */}

              <Panel
                title="Problem–Solution Assessment"
                eyebrow="Initial evaluation"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#0A0A0A] p-4">
                    <h4 className="font-semibold text-emerald-300">
                      Potential strengths
                    </h4>

                    {result.strengths?.length ? (
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">
                        {result.strengths.map((item, index) => (
                          <li key={`${item}-${index}`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-zinc-500">
                        No strengths were returned.
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl bg-[#0A0A0A] p-4">
                    <h4 className="font-semibold text-amber-300">
                      Potential weaknesses
                    </h4>

                    {result.weaknesses?.length ? (
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">
                        {result.weaknesses.map((item, index) => (
                          <li key={`${item}-${index}`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-zinc-500">
                        No weaknesses were returned. This does not
                        mean there are no risks.
                      </p>
                    )}
                  </div>
                </div>
              </Panel>

              {/* Risks */}

              <Panel
                title="Risks to Validate"
                eyebrow="Potential risks"
              >
                {result.risk_assessment?.length ? (
                  <div className="grid gap-3">
                    {result.risk_assessment.map(
                      (item, index) => (
                        <article
                          key={`${item.risk ?? "risk"}-${index}`}
                          className="rounded-xl border border-zinc-800 bg-[#0A0A0A] p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="font-semibold">
                              {item.risk ?? "Potential risk"}
                            </h4>

                            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase text-amber-300">
                              {item.severity ?? "Unrated"}
                            </span>
                          </div>

                          {item.source && (
                            <p className="mt-2 text-xs text-zinc-500">
                              Source: {humanize(item.source)}
                            </p>
                          )}
                        </article>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400">
                    No risks were returned by the current analysis.
                  </p>
                )}
              </Panel>

              {/* Recommendations */}

              <Panel
                title="Recommended Next Steps"
                eyebrow="Action plan"
              >
                {result.recommendations?.length ? (
                  <div className="grid gap-4">
                    {result.recommendations.map(
                      (item, index) => (
                        <article
                          key={`${item.title ?? "recommendation"}-${index}`}
                          className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <h4 className="text-lg font-semibold">
                              {item.title ??
                                `Recommendation ${index + 1}`}
                            </h4>

                            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase text-blue-300">
                              {item.priority ?? "Suggested"}{" "}
                              priority
                            </span>
                          </div>

                          {item.description && (
                            <p className="mt-3 leading-7 text-zinc-300">
                              {item.description}
                            </p>
                          )}

                          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                            {item.timeline && (
                              <div>
                                <p className="text-zinc-500">
                                  Timeline
                                </p>
                                <p className="mt-1 text-zinc-200">
                                  {item.timeline}
                                </p>
                              </div>
                            )}

                            {item.key_metrics && (
                              <div>
                                <p className="text-zinc-500">
                                  Measure success with
                                </p>
                                <p className="mt-1 text-zinc-200">
                                  {item.key_metrics}
                                </p>
                              </div>
                            )}
                          </div>
                        </article>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400">
                    No recommendations were returned.
                  </p>
                )}
              </Panel>

              {/* MVP roadmap */}

              <Panel
                title="MVP Roadmap"
                eyebrow="Product development plan"
              >
                <p className="mb-5 text-sm leading-6 text-zinc-400">
                  These roadmap items are based on the planning
                  templates returned by your backend. Adapt them to
                  your actual startup and validate the priorities.
                </p>

                <RecordCards
                  records={planning?.mvp_roadmap_templates}
                  emptyText="No MVP roadmap templates were returned. Check whether mvp_roadmap_templates.csv exists, contains data, and is loaded by the AI service."
                />
              </Panel>

              {/* Customer personas */}

              <Panel
                title="Customer Persona Hypotheses"
                eyebrow="Who to interview"
              >
                <RecordCards
                  records={planning?.customer_personas}
                  emptyText="No customer persona records were returned."
                />

                {planning?.data_notes?.customer_personas && (
                  <p className="mt-4 text-xs text-zinc-500">
                    {planning.data_notes.customer_personas}
                  </p>
                )}
              </Panel>

              {/* Launch strategy */}

              <Panel
                title="Launch Strategy Ideas"
                eyebrow="Go-to-market planning"
              >
                <RecordCards
                  records={planning?.launch_strategy_templates}
                  emptyText="No launch strategy templates were returned."
                />

                {planning?.data_notes?.launch_strategies && (
                  <p className="mt-4 text-xs text-zinc-500">
                    {planning.data_notes.launch_strategies}
                  </p>
                )}
              </Panel>

              {/* Financial assumptions */}

              <Panel
                title="Financial Assumptions"
                eyebrow="Illustrative only"
              >
                <RecordCards
                  records={planning?.financial_assumptions}
                  emptyText="No financial assumptions were returned for this industry. Missing data does not mean zero costs or zero revenue."
                />

                {planning?.data_notes?.financial_assumptions && (
                  <p className="mt-4 text-xs text-zinc-500">
                    {planning.data_notes.financial_assumptions}
                  </p>
                )}
              </Panel>

              {/* Competitors */}

              <Panel
                title="Competitors and Alternatives"
                eyebrow="Knowledge-base records"
              >
                <p className="mb-5 text-sm leading-6 text-zinc-400">
                  These records come from your current dataset.
                  Generic categories are not necessarily verified,
                  named competitors.
                </p>

                <RecordCards
                  records={result.competitor_analysis}
                  emptyText="No competitor records were returned for this industry."
                />
              </Panel>

              {/* Retrieved knowledge */}

              <Panel
                title="Retrieved Knowledge"
                eyebrow="Supporting context"
              >
                {knowledgeItems.length ? (
                  <div className="grid gap-4">
                    {knowledgeItems.map((item, index) => (
                      <article
                        key={`${item.type ?? "knowledge"}-${index}`}
                        className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase text-blue-300">
                            {humanize(
                              String(
                                item.type ??
                                  item.source ??
                                  "knowledge"
                              )
                            )}
                          </span>

                          <span className="text-xs text-zinc-500">
                            {typeof item.similarity === "number"
                              ? `Similarity: ${item.similarity.toFixed(2)}`
                              : ""}
                            {typeof item.relevance_score === "number"
                              ? ` · Ranking score: ${item.relevance_score.toFixed(1)}`
                              : ""}
                          </span>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap leading-7 text-zinc-300">
                          {String(item.text ?? "")}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400">
                    No knowledge records were returned.
                  </p>
                )}
              </Panel>
            </section>
          )}
        </div>
      </main>
    </>
  );
}