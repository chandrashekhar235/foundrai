const stack = [
  "Next.js",
  "Express",
  "TypeScript",
  "MongoDB",
  "TailwindCSS",
  "JWT",
  "Google OAuth",
  "LangChain",
  "LangGraph",
];

export default function TechStack() {
  return (
    <section className="px-6 py-24">

      <div className="mx-auto max-w-6xl">

        <h2 className="text-center text-5xl font-bold">
          Built Using Modern Technology
        </h2>

        <div className="mt-20 flex flex-wrap justify-center gap-6">

          {stack.map((tech) => (

            <div
              key={tech}
              className="rounded-full border border-blue-600 bg-[#111827] px-8 py-4 text-lg"
            >
              {tech}
            </div>

          ))}

        </div>

      </div>

    </section>
  );
}