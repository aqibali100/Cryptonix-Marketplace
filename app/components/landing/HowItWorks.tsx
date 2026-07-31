const steps = [
  {
    number: "01",
    icon: "◇",
    title: "Connect Wallet",
    text: "Connect securely with your preferred wallet in just a few clicks.",
  },
  {
    number: "02",
    icon: "✦",
    title: "Create NFT",
    text: "Upload your work, tell its story, and mint it on your chosen chain.",
  },
  {
    number: "03",
    icon: "↗",
    title: "Trade Assets",
    text: "List, discover, bid, and build a collection that belongs to you.",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="how-section page-shell py-[120px] px-0 max-[600px]:py-[75px] max-[600px]:px-0 w-[min(1180px,_calc(100%_-_40px))] [margin-inline:auto] max-[600px]:w-[min(100%_-_28px,_1180px)]"
      id="how-it-works"
    >
      <div className="how-heading max-w-[620px] [margin:0_auto_60px] text-center [&_h2]:[margin:8px_0_13px] [&_p]:text-[#748096] [&_p]:text-[12px] [&_p]:leading-[1.7]">
        <span className="section-kicker text-[var(--cyan)] text-[12px] font-bold tracking-[2px]">
          SIMPLE BY DESIGN
        </span>
        <h2 className="mt-[7px] mb-0 text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
          Your journey starts here.
        </h2>
        <p>
          From your first connection to your next great acquisition, Cryptonix keeps every step
          clear and secure.
        </p>
      </div>
      <div className="steps-grid grid grid-cols-[repeat(3,1fr)] gap-15 max-[900px]:gap-5 max-[600px]:grid-cols-[1fr] max-[600px]:gap-[50px]">
        {steps.map((step, index) => (
          <article
            className="step-card relative text-center [&_h3]:text-[15px] [&_p]:max-w-[260px] [&_p]:[margin:10px_auto_0] [&_p]:text-[#6e798f] [&_p]:text-[12px] [&_p]:leading-[1.65]"
            key={step.number}
          >
            <span className="step-number absolute top-0 left-[15%] text-[rgba(155,123,255,.15)] text-[48px] font-bold">
              {step.number}
            </span>
            <div className="step-icon grid w-[65px] h-[65px] [margin:0_auto_20px] place-items-center border-[1px_solid_rgba(155,123,255,.24)] rounded-[20px] bg-[linear-gradient(145deg,rgba(155,123,255,.13),rgba(71,215,204,.04))] shadow-[0_15px_40px_rgba(0,0,0,.2)] text-[#a991f8] text-2xl">
              {step.icon}
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            {index < 2 && (
              <i className="step-line absolute right-[-41px] top-[25px] text-[#4f596e] not-italic max-[900px]:hidden">
                →
              </i>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
