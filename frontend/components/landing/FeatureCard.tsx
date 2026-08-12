type FeatureCardProps = {
  title: string;
  description: string;
};

export default function FeatureCard({
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-zinc-800 bg-[#111827] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-[0_0_35px_rgba(37,99,235,0.25)]">
      <h3 className="mb-3 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="leading-7 text-zinc-400">
        {description}
      </p>
    </div>
  );
}