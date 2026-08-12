const values = [
  {
    title: "Innovation",
    desc: "We continuously improve our AI to empower founders with better startup insights.",
  },
  {
    title: "Simplicity",
    desc: "Complex business strategies transformed into simple, actionable guidance.",
  },
  {
    title: "Founder First",
    desc: "Every feature is designed to save founders time and increase their chances of success.",
  },
];

export default function Values() {
  return (
    <section className="px-6 py-24">

      <div className="mx-auto max-w-6xl">

        <h2 className="text-center text-5xl font-bold">
          Our Core Values
        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          {values.map((value) => (

            <div
              key={value.title}
              className="rounded-3xl border border-zinc-800 bg-[#111827] p-8 transition hover:border-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,.25)]"
            >

              <h3 className="text-2xl font-bold">
                {value.title}
              </h3>

              <p className="mt-5 text-zinc-400 leading-7">
                {value.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}