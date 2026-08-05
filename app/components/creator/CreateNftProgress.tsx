const steps = [
  {
    label: "Artwork",
    description: "Upload & Edition",
    icon: (
      <>
        <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
        <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
      </>
    ),
  },
  {
    label: "Details",
    description: "Metadata & Traits",
    icon: (
      <>
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M15 3v5h5M10 12h5M10 16h5" />
      </>
    ),
  },
  {
    label: "Blockchain",
    description: "Chain, Royalty & Sale",
    icon: (
      <>
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2A5 5 0 0 0 12 4l-1.1 1.1" />
        <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
      </>
    ),
  },
  {
    label: "Review",
    description: "Confirm & Mint",
    icon: (
      <>
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M15 3v5h5M10 14l2 2 4-4" />
      </>
    ),
  },
];

function StepIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
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

export default function CreateNftProgress({
  currentStep,
  onStepChange,
}: {
  currentStep: number;
  onStepChange: (step: number) => void;
}) {
  const lineProgress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <nav
      aria-label="NFT creation progress"
      className="mb-4 p-4 pt-0"
    >
      <div className="relative">
        <div className="absolute left-[12.5%] right-[12.5%] top-5 h-px bg-white/[.09] max-[620px]:hidden">
          <span
            className="block h-full bg-[linear-gradient(90deg,#55d9cb,#8d6bff)] transition-[width] duration-500 ease-out"
            style={{ width: `${lineProgress}%` }}
          />
        </div>

        <ol className="relative grid grid-cols-4 max-[620px]:grid-cols-1 max-[620px]:gap-2">
          {steps.map((item, index) => {
            const number = index + 1;
            const active = currentStep === number;
            const complete = currentStep > number;
            const accessible = number <= currentStep;

            return (
              <li className="flex justify-center" key={item.label}>
                <button
                  aria-current={active ? "step" : undefined}
                  className={`group flex w-full flex-col items-center rounded-xl px-2 text-center transition max-[620px]:flex-row max-[620px]:gap-3 max-[620px]:px-3 max-[620px]:py-2.5 max-[620px]:text-left ${accessible ? "cursor-pointer" : "cursor-default"}`}
                  disabled={!accessible}
                  onClick={() => accessible && onStepChange(number)}
                  type="button"
                >
                  <span
                    className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition duration-300 ${active ? "border-[#8d6bff] bg-[#7658dd] text-white shadow-[0_0_0_5px_rgba(126,95,255,.1),0_8px_22px_rgba(105,72,235,.3)]" : complete ? "border-emerald-400/35 bg-[#0d2928] text-emerald-300" : "border-white/[.09] bg-[#0b0f1e] text-[#4e5a70]"}`}
                  >
                    {complete ? <CheckIcon /> : <StepIcon>{item.icon}</StepIcon>}
                  </span>

                  <span className="mt-3 min-w-0 max-[620px]:mt-0">
                    <small
                      className={`block text-[8px] font-bold uppercase tracking-[1.3px] ${active ? "text-[#aa94f4]" : complete ? "text-emerald-300/70" : "text-[#4f5b70]"}`}
                    >
                      {complete ? "Completed" : active ? "In progress" : `Step ${number}`}
                    </small>
                    <strong
                      className={`mt-1 block truncate text-[11px] ${active || complete ? "text-[#edf0f7]" : "text-[#747f93]"}`}
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
    </nav>
  );
}
