
"use client";

import { workflowSteps } from "./WorkflowData";

export default function Workflow() {
  const renderSteps = (duplicate = false) => (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={duplicate}
    >
      {workflowSteps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Workflow Card */}
          <div className="workflow-card group relative flex h-[175px] w-[240px] shrink-0 flex-col justify-between rounded-2xl border border-zinc-800 bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.18)]">

            <div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-blue-500">
                  {String(step.id).padStart(2, "0")}
                </span>

                <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                  {step.duration}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-white">
                {step.title}
              </h3>
            </div>

            <p className="h-10 overflow-hidden text-xs leading-5 text-zinc-400">
              {step.description}
            </p>

            {/* Bottom progress line */}
            <div className="absolute bottom-0 left-5 right-5 h-[2px] bg-zinc-800">
              <div className="h-full w-0 bg-blue-500 transition-all duration-500 group-hover:w-full" />
            </div>
          </div>

          {/* Connector */}
          {index !== workflowSteps.length - 1 && (
            <div className="flex w-14 shrink-0 items-center justify-center">
              <div className="relative h-[2px] w-full bg-blue-500/30">
                <div className="workflow-pulse absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-transparent via-blue-400 to-blue-500" />
              </div>

              <span className="-ml-1 text-xl text-blue-500">
                ›
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section className="overflow-hidden py-20">

      {/* Heading */}
      <div className="mx-auto mb-14 max-w-4xl px-6 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">
          The Process
        </span>

        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
          How FoundrAI Works
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
          From startup idea to launch-ready strategy.
          Watch AI transform your vision into an actionable business blueprint.
        </p>
      </div>

      {/* Animated Workflow */}
      <div className="workflow-mask relative w-full">

        <div className="workflow-track flex w-max items-center">

          {/* First sequence */}
          <div className="flex shrink-0 items-center pr-14">
            {renderSteps()}
          </div>

          {/* Duplicate for seamless animation */}
          <div className="flex shrink-0 items-center pr-14">
            {renderSteps(true)}
          </div>

        </div>
      </div>

      {/* Bottom label */}
      <div className="mt-10 flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-zinc-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
        10 Steps · One Complete Startup Blueprint
      </div>

    </section>
  );
}
