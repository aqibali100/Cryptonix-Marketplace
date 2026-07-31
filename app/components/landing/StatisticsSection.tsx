const stats = [
  { label: "Total Volume", value: "24,500", unit: "ETH", change: "+14.2%" },
  { label: "Total NFTs", value: "125K", unit: "", change: "+8.8%" },
  { label: "Creators", value: "8,200", unit: "", change: "+12.1%" },
];

export default function StatisticsSection() {
  return (
    <section className="statistics-section relative overflow-hidden border-t-[1px_solid_var(--line)] py-[95px] px-0 bg-[linear-gradient(135deg,rgba(112,77,210,.09),rgba(55,211,200,.025))]">
      <div className="stats-glow absolute left-[50%] top-[50%] w-[500px] h-[250px] rounded-full bg-[rgba(114,77,219,.12)] [filter:blur(90px)] [transform:translate(-50%,-50%)]" />
      <div className="page-shell statistics-inner w-[min(1180px,_calc(100%_-_40px))] [margin-inline:auto] max-[600px]:w-[min(100%_-_28px,_1180px)] relative grid grid-cols-[1fr_1.5fr] items-center gap-[70px] [&_h2]:mt-2.5 [&_h2]:text-[38px] [&_h2_span]:text-[#a38afa] max-[900px]:grid-cols-[1fr] max-[900px]:text-center max-[600px]:gap-[45px] max-[600px]:[&_h2]:text-[32px]">
        <div>
          <span className="section-kicker text-[var(--cyan)] text-[12px] font-bold tracking-[2px]">
            THE CRYPTONIX ECONOMY
          </span>
          <h2 className="mt-[7px] mb-0 text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
            Built by creators.
            <br />
            <span>Owned by everyone.</span>
          </h2>
        </div>
        <div className="large-stats grid grid-cols-[repeat(3,1fr)] [&_article]:grid [&_article]:gap-[13px] [&_article]:border-l-[1px_solid_var(--line)] [&_article]:pl-7 [&_article>span]:flex [&_article>span]:items-center [&_article>span]:justify-between [&_article>span]:text-[#788399] [&_article>span]:text-[12px] [&_article_i]:mr-5 [&_article_i]:text-[#57dcb8] [&_article_i]:not-italic [&_strong]:text-[30px] [&_strong]:tracking-[-1.3px] [&_small]:text-[#9f87ed] [&_small]:text-[12px] max-[900px]:[&_article]:text-left max-[600px]:grid-cols-[1fr] max-[600px]:gap-0 max-[600px]:[&_article]:border-l-[0] max-[600px]:[&_article]:border-t-[1px_solid_var(--line)] max-[600px]:[&_article]:py-4.5 max-[600px]:[&_article]:px-0 max-[600px]:[&_article]:text-left max-[600px]:[&_article_i]:m-0">
          {stats.map((stat) => (
            <article key={stat.label}>
              <span>
                {stat.label}
                <i>{stat.change}</i>
              </span>
              <strong>
                {stat.value} <small>{stat.unit}</small>
              </strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
