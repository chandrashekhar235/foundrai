type PricingCardProps = {
  name: string;
  description: string;
  price: number;
  popular: boolean;
  buttonText: string;
  features: string[];
};

export default function PricingCard({
  name,
  description,
  price,
  popular,
  buttonText,
  features,
}: PricingCardProps) {
  return (
    <div
      className={`
        relative
        flex
        flex-col
        rounded-3xl
        border
        p-8
        transition-all
        duration-300

        ${
          popular
            ? "scale-105 border-blue-500 bg-[#111827] shadow-[0_0_40px_rgba(37,99,235,0.25)]"
            : "border-zinc-800 bg-[#111827] hover:-translate-y-2 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]"
        }
      `}
    >
      {/* Popular Badge */}

      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white">
          Most Popular
        </div>
      )}

      {/* Plan Name */}

      <h3 className="mt-4 text-3xl font-bold text-white">
        {name}
      </h3>

      {/* Description */}

      <p className="mt-3 leading-7 text-zinc-400">
        {description}
      </p>

      {/* Price */}

      <div className="mt-8 flex items-end gap-1">
        {name === "Enterprise" ? (
          <span className="text-5xl font-bold text-white">
            Custom
          </span>
        ) : (
          <>
            <span className="text-5xl font-bold text-white">
              ₹{price}
            </span>

            <span className="mb-1 text-zinc-400">
              /month
            </span>
          </>
        )}
      </div>

      {/* Divider */}

      <div className="my-8 h-px bg-zinc-800" />

      {/* Features */}

      <ul className="flex-1 space-y-4">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-3 text-zinc-300"
          >
            <span className="text-blue-500">✓</span>

            {feature}
          </li>
        ))}
      </ul>

      {/* Button */}

      <button
        className={`
          mt-10
          h-12
          rounded-xl
          font-semibold
          transition-all

          ${
            popular
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "border border-zinc-700 text-white hover:border-blue-500"
          }
        `}
      >
        {buttonText}
      </button>
    </div>
  );
}