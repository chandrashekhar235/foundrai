"use client";

import { useState } from "react";
import { workflowSteps } from "./WorkflowData";

export default function Workflow() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-28 px-6">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <h2 className="text-center text-6xl font-extrabold tracking-tight text-white">
          How FoundrAI Works
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-zinc-400">
          Every startup follows a journey. FoundrAI automates each stage—from
          validating your idea to generating a launch-ready business strategy.
        </p>

        {/* Workflow */}
        <div className="mt-20 flex flex-col items-center">
          {workflowSteps.map((step, index) => (
            <div
              key={step.id}
              className="flex w-full flex-col items-center"
            >
              {/* Card */}
              <div
                onMouseEnter={() => setActive(index)}
                className={`
                  w-full
                  cursor-pointer
                  overflow-hidden
                  rounded-3xl
                  border
                  bg-[#111827]
                  transition-all
                  duration-500

                  ${
                    active === index
                      ? "scale-[1.01] border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.25)]"
                      : "border-zinc-800 hover:border-zinc-700"
                  }
                `}
              >
                <div className="p-10">
                  {/* Number */}
                  <span
                    className={`
                      text-6xl
                      font-black
                      transition-colors
                      duration-300

                      ${
                        active === index
                          ? "text-blue-500"
                          : "text-zinc-700"
                      }
                    `}
                  >
                    {String(step.id).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <h3 className="mt-5 text-3xl font-bold text-white">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`
                      overflow-hidden
                      text-zinc-400
                      leading-8
                      transition-all
                      duration-500

                      ${
                        active === index
                          ? "mt-5 max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    {step.description}
                  </p>

                  {/* Duration */}
                  <div
                    className={`
                      mt-6
                      text-sm
                      uppercase
                      tracking-wider
                      transition-colors

                      ${
                        active === index
                          ? "text-blue-400"
                          : "text-zinc-600"
                      }
                    `}
                  >
                    Estimated Time • {step.duration}
                  </div>
                </div>
              </div>

          
              {index !== workflowSteps.length - 1 && (
                <div className="flex flex-col items-center py-6">
                  <div className="h-12 w-px bg-gradient-to-b from-blue-500 via-blue-400 to-transparent" />

                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.7)]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}