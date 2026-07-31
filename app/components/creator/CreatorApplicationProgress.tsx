const steps = [
  {
    label: "Identity",
    description: "Personal details",
    icon: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      </>
    ),
  },
  {
    label: "Portfolio",
    description: "Your creative work",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="m5.5 17 4-4 3 3 2.5-2.5 3.5 3.5" />
      </>
    ),
  },
  {
    label: "Declaration",
    description: "Review and submit",
    icon: (
      <>
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M15 3v5h5M10 13l2 2 4-4" />
      </>
    ),
  },
];

function StepIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function CheckIcon() {
  return (
    <StepIcon>
      <path d="m5 12 4 4L19 6" />
    </StepIcon>
  );
}

export default function CreatorApplicationProgress({
  currentStep,
  onStepChange,
}: {
  currentStep: number;
  onStepChange: (step: number) => void;
}) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <nav
      aria-label="Creator application progress"
      className="mb-3 rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,.018)] p-4 shadow-[0_18px_50px_rgba(0,0,0,.14)] sm:px-7"
    >
      <div className="relative">
        <div className="absolute left-[16.667%] right-[16.667%] top-5 h-px bg-white/[.09] max-[540px]:hidden">
          <span
            className="block h-full bg-[linear-gradient(90deg,#55d9cb,#8d6bff)] transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ol className="relative grid grid-cols-3 max-[540px]:grid-cols-1 max-[540px]:gap-2">
          {steps.map((item, index) => {
            const number = index + 1;
            const active = currentStep === number;
            const complete = currentStep > number;
            const accessible = number <= currentStep;

            return (
              <li className="flex justify-center" key={item.label}>
                <button
                  aria-current={active ? "step" : undefined}
                  className={`group flex w-full flex-col items-center rounded-xl px-2 text-center transition max-[540px]:flex-row max-[540px]:gap-3 max-[540px]:px-3 max-[540px]:py-2.5 max-[540px]:text-left ${
                    accessible ? "cursor-pointer" : "cursor-default"
                  }`}
                  disabled={!accessible}
                  onClick={() => accessible && onStepChange(number)}
                  type="button"
                >
                  <span
                    className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition duration-300 ${
                      active
                        ? "border-[#8d6bff] bg-[#7658dd] text-white shadow-[0_0_0_5px_rgba(126,95,255,.1),0_8px_22px_rgba(105,72,235,.3)]"
                        : complete
                          ? "border-emerald-400/35 bg-[#0d2928] text-emerald-300"
                          : "border-white/[.09] bg-[#0b0f1e] text-[#4e5a70]"
                    }`}
                  >
                    {complete ? <CheckIcon /> : <StepIcon>{item.icon}</StepIcon>}
                  </span>

                  <span className="mt-3 min-w-0 max-[540px]:mt-0">
                    <small
                      className={`block text-[8px] font-bold uppercase tracking-[1.3px] ${
                        active
                          ? "text-[#aa94f4]"
                          : complete
                            ? "text-emerald-300/70"
                            : "text-[#4f5b70]"
                      }`}
                    >
                      {complete ? "Completed" : active ? "In progress" : `Step ${number}`}
                    </small>
                    <strong
                      className={`mt-1 block truncate text-[11px] ${
                        active || complete ? "text-[#edf0f7]" : "text-[#747f93]"
                      }`}
                    >
                      {item.label}
                    </strong>
                    <span className="mt-1 block truncate text-[8px] text-[#566176]">
                      {item.description}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-white/[.05] pt-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[.045]">
          <span
            className="block h-full rounded-full bg-[linear-gradient(90deg,#7456e7,#53d8cc)] transition-[width] duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-[8px] font-semibold text-[#7e6dbe]">
          Step {currentStep} of {steps.length}
        </span>
      </div>
    </nav>
  );
}
