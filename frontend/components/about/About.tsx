import Mission from "./Mission";
import Values from "./Values";
import TechStack from "./TechStack";
import Roadmap from "./Roadmap";
import Founder from "./Founder";
import CTA from "./CTA";

export default function About() {
  return (
    <main className="bg-[#0A0A0A] text-white">

      <section className="px-6 py-32">
        <div className="mx-auto max-w-6xl text-center">

          <p className="mb-5 text-blue-500 font-semibold tracking-widest uppercase">
            About FoundrAI
          </p>

          <h1 className="text-6xl font-extrabold leading-tight">
            Building the Future of
            <br />
            Startup Creation
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
            FoundrAI is your AI Co-Founder that helps entrepreneurs validate
            ideas, research markets, build business models and launch startups
            faster using Artificial Intelligence.
          </p>

        </div>
      </section>

      <Mission />
      <Values />
      <TechStack />
      <Roadmap />
      <CTA />
      <Founder />

    </main>
  );
}