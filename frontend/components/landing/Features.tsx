"use client";

import FeatureCard from "./FeatureCard";
import { features } from "./FeaturesData";

export default function Features() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-6xl font-extrabold tracking-tight text-white">
            Everything You Need to Build Your Startup
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            From validating your idea to launching your product, FoundrAI
            provides every essential tool in one intelligent platform.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
  <FeatureCard
    key={feature.id}
    title={feature.title}
    description={feature.description}
  />
))}
        </div>
      </div>
    </section>
  );
}