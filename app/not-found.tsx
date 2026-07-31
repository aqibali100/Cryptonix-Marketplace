export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-[calc(100vh-70px)] place-items-center overflow-hidden px-5 pb-20 pt-[130px] max-[600px]:pt-[110px]">
      <div className="pointer-events-none absolute left-1/2 top-[46%] -z-20 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(116,83,238,.19),rgba(34,202,194,.07)_32%,transparent_69%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-[.14] [background-image:linear-gradient(rgba(155,123,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(155,123,255,.15)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(circle_at_center,#000,transparent_68%)]" />

      <section className="relative w-full max-w-[940px] text-center">
        <div className="relative mx-auto mb-2 grid h-[310px] w-[min(620px,100%)] place-items-center max-[600px]:h-[230px]">
          <div className="not-found-orbit absolute h-[270px] w-[270px] rounded-full border border-dashed border-[rgba(155,123,255,.2)] max-[600px]:h-[205px] max-[600px]:w-[205px]">
            <span className="absolute left-1/2 top-[-7px] h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[var(--cyan)] shadow-[0_0_20px_rgba(83,232,220,.9)]" />
          </div>
          <div className="not-found-orbit-reverse absolute h-[205px] w-[430px] rounded-[50%] border border-[rgba(83,232,220,.12)] max-[600px]:h-[160px] max-[600px]:w-[300px]" />

          <p
            aria-label="Error 404"
            className="not-found-float relative m-0 bg-[linear-gradient(105deg,#ffffff_5%,#a78cff_46%,#5de9dc_92%)] bg-clip-text text-[clamp(112px,20vw,210px)] font-semibold leading-none tracking-[-14px] text-transparent drop-shadow-[0_20px_65px_rgba(108,77,224,.28)] max-[600px]:tracking-[-8px]"
          >
            404
          </p>

          <div className="absolute left-[10%] top-[28%] rounded-xl border border-[var(--line)] bg-[#0b0f20]/80 px-3 py-2 text-[11px] text-[#7c879b] shadow-[0_12px_35px_rgba(0,0,0,.35)] backdrop-blur-xl max-[600px]:left-0 max-[600px]:top-[16%]">
            <span className="mr-2 text-rose-300">●</span>
            SIGNAL LOST
          </div>
          <div className="absolute bottom-[20%] right-[8%] flex items-center gap-2 rounded-xl border border-[rgba(83,232,220,.14)] bg-[#0b0f20]/80 px-3 py-2 text-[11px] text-[#91a0b6] shadow-[0_12px_35px_rgba(0,0,0,.35)] backdrop-blur-xl max-[600px]:bottom-[10%] max-[600px]:right-0">
            <span className="not-found-signal h-2 w-2 rounded-full bg-[var(--cyan)]" />
            SCANNING CHAIN
          </div>
        </div>

        <span className="text-[11px] font-bold tracking-[2.4px] text-[var(--cyan)]">
          PAGE NOT FOUND
        </span>
        <h1 className="mx-auto mb-0 mt-3 max-w-[700px] text-[clamp(34px,5vw,54px)] font-semibold leading-[1.02] tracking-[-2.8px]">
          We couldn&apos;t find this page.
        </h1>
        <p className="mx-auto mb-0 mt-5 max-w-[570px] text-[13px] leading-6 text-[#7f8ba1]">
          It may have moved or the link may be incorrect.
        </p>
      </section>
    </main>
  );
}
