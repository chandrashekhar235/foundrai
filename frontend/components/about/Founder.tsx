export default function Founder() {
    return (
        <section className="px-6 py-28">
            <div className="mx-auto max-w-6xl grid items-center gap-16 lg:grid-cols-2">
                <div>
                    <p className="mb-3 uppercase tracking-[0.3rem] text-blue-500">
                        Founder</p>
                        <h2 className="text-5xl font-bold">
                            Built by an engineer
                            <br />
                            Designed by engineer
                            </h2>
                            <p className="mt-8 text-lg leading-8 text-zinc-400">
            FoundrAI was created with one vision:
            help entrepreneurs validate ideas faster using AI.
            Instead of spending weeks researching markets,
            competitors and customer needs,
            FoundrAI delivers actionable insights within minutes.
          </p>

          <p className="mt-6 text-zinc-400 leading-8">
            Every feature has been designed to remove guesswork
            from startup building and let founders focus on
            execution instead of endless research.
          </p>
        </div>

        {/* Right */}
        <div className="flex justify-center">
          <div className="h-[420px] w-[340px] rounded-3xl border border-zinc-800 bg-[#111827] flex items-center justify-center">
            Founder Image
          </div>


                </div>
            </div>
        </section>
    );
}