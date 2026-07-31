export default function FloatingCards() {
  return (
    <>
      <div className="floating-proof glass absolute z-[4] flex items-center gap-[9px] rounded-[13px] py-2.5 px-3 left-[-15px] top-[145px] [&>span]:grid [&>span]:w-[27px] [&>span]:h-[27px] [&>span]:place-items-center [&>span]:rounded-[9px] [&>span]:bg-[rgba(84,222,210,.12)] [&>span]:text-[#5ce1d5] [&>span]:text-[12px] [&_p]:grid [&_p]:gap-[3px] [&_strong]:text-[12px] [&_small]:text-[#667187] [&_small]:text-[12px] max-[600px]:left--1 max-[600px]:top-[105px] border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]">
        <span>✓</span>
        <p>
          <strong>Verified asset</strong>
          <small>Secured on-chain</small>
        </p>
      </div>
      <div className="floating-sale glass absolute z-[4] flex items-center gap-[9px] rounded-[13px] py-2.5 px-3 right--2 bottom-[150px] [&>span]:grid [&>span]:w-[27px] [&>span]:h-[27px] [&>span]:place-items-center [&>span]:rounded-[9px] [&>span]:bg-[rgba(84,222,210,.12)] [&>span]:text-[#5ce1d5] [&>span]:text-[12px] [&>span]:bg-[rgba(155,123,255,.13)] [&>span]:text-[#aa91ff] [&_p]:grid [&_p]:gap-[3px] [&_strong]:text-[12px] [&_small]:text-[#667187] [&_small]:text-[12px] max-[600px]:right-[-5px] max-[600px]:bottom-[105px] border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]">
        <span>↗</span>
        <p>
          <small>Last sale</small>
          <strong>2.85 ETH</strong>
        </p>
      </div>
      <div className="floating-users absolute z-[4] left-[7%] bottom-[103px] border-[1px_solid_rgba(255,255,255,.1)] rounded-[99px] py-[7px] px-2.5 bg-[rgba(7,9,20,.75)] text-[#8a95a9] text-[12px] [&_i]:not-italic max-[600px]:hidden">
        <i>84 people viewing</i>
      </div>
    </>
  );
}
