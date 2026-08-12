import { WorkflowStep } from "./WorkflowData";
type Props = {
  step: WorkflowStep;
  active: boolean;
  onHover: () => void;
};

export default function WorkflowCard({
  step,
  active,
  onHover,
}: Props) {
  return (
    <div
      onMouseEnter={onHover}
      className={`
        w-full rounded-3xl border bg-[#111827]
        transition-all duration-500 cursor-pointer overflow-hidden
        ${
          active
            ? "border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.25)] scale-[1.01]"
            : "border-zinc-800 hover:border-zinc-700"
        }
      `}
    >
      <div className="p-10">
        <span
          className={`text-6xl font-black ${
            active ? "text-blue-500" : "text-zinc-700"
          }`}
        >
          {String(step.id).padStart(2, "0")}
        </span>

        <h3 className="mt-5 text-3xl font-bold text-white">
          {step.title}
        </h3>

        <p
          className={`
            overflow-hidden transition-all duration-500
            text-zinc-400 leading-8
            ${
              active
                ? "mt-5 max-h-40 opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
        >
          {step.description}
        </p>

        <div
          className={`mt-6 text-sm uppercase tracking-wider ${
            active ? "text-blue-400" : "text-zinc-600"
          }`}
        >
          Estimated Time • {step.duration}
        </div>
      </div>
    </div>
  );
}