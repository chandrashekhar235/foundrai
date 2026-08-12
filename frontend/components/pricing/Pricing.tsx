"use client";

import { useState } from "react";
import PricingCard from "./PricingCard";
import { pricingPlans } from "./PricingData";

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="px-6 py-28">

      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <div className="text-center">

          <h2 className="text-6xl font-extrabold tracking-tight text-white">
            Simple, Transparent Pricing
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Choose the perfect plan for your startup journey.
            Upgrade anytime as your business grows.
          </p>

        </div>

        {/* Billing Toggle */}

        <div className="mt-14 flex justify-center">

          <div className="flex items-center gap-5 rounded-full border border-zinc-800 bg-[#111827] p-2">

            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-6 py-2 font-medium transition ${
                !yearly
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setYearly(true)}
              className={`rounded-full px-6 py-2 font-medium transition ${
                yearly
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400"
              }`}
            >
              Yearly
            </button>

          </div>

        </div>

        {/* Pricing Cards */}

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {pricingPlans.map((plan) => (

            <PricingCard
              key={plan.id}
              name={plan.name}
              description={plan.description}
              price={
                yearly
                  ? plan.yearlyPrice
                  : plan.monthlyPrice
              }
              popular={plan.popular}
              buttonText={plan.buttonText}
              features={plan.features}
            />

          ))}

        </div>

      </div>

    </section>
  );
}