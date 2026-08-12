const roadmap = [
  "AI Research",
  "Business Model Generator",
  "Pitch Deck Generator",
  "Financial Forecast",
  "AI Mentor",
  "Investor Matching",
];

export default function Roadmap() {
  return (
    <section className="px-6 py-24">

      <div className="mx-auto max-w-3xl">

        <h2 className="text-center text-5xl font-bold">
          Product Roadmap
        </h2>

        <div className="mt-20 space-y-8">

          {roadmap.map((item, index) => (

            <div
              key={item}
              className="rounded-2xl border border-zinc-800 bg-[#111827] p-6"
            >

              <div className="flex items-center gap-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
                  {index + 1}
                </div>

                <h3 className="text-xl font-semibold">
                  {item}
                </h3>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}