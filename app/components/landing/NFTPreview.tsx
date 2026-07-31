import Link from "next/link";

export default function NFTPreview() {
  return (
    <article className="landing-nft-preview glass relative z-[2] w-[min(405px,88%)] overflow-hidden rounded-[27px] p-[11px] [transform:rotate(1.5deg)] max-[600px]:w-[94%] max-[360px]:w-full max-[360px]:rounded-[22px] max-[360px]:p-2 border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]">
      <div className="preview-art-main relative grid h-[360px] overflow-hidden place-items-center rounded-[19px] bg-[radial-gradient(circle_at_18%_18%,rgba(91,232,220,.55),transparent_2%),radial-gradient(circle_at_78%_72%,rgba(194,113,255,.55),transparent_2%),radial-gradient(circle_at_center,#7651bc,transparent_34%),linear-gradient(145deg,#102741,#18113b_58%,#321d49)] [&>button]:absolute [&>button]:right-[13px] [&>button]:top-[13px] [&>button]:grid [&>button]:w-[30px] [&>button]:h-[30px] [&>button]:place-items-center [&>button]:border-[1px_solid_rgba(255,255,255,.14)] [&>button]:rounded-full [&>button]:bg-[rgba(5,7,17,.5)] [&>button]:text-[15px] max-[600px]:h-[300px] max-[360px]:h-[270px]">
        <div className="preview-sphere z-[2] w-[175px] h-[175px] rounded-full bg-[radial-gradient(circle_at_30%_24%,#f3ddff,#a875db_22%,#50336f_57%,#171631_82%)] shadow-[inset_-28px_-20px_40px_rgba(5,5,18,.72),0_0_70px_rgba(140,85,220,.52)] max-[600px]:w-[145px] max-[600px]:h-[145px]" />
        <div className="preview-orbit absolute z-[3] w-[330px] h-[65px] border-[1.5px_solid_rgba(157,226,226,.45)] rounded-full [transform:rotate(-19deg)] shadow-[0_0_20px_rgba(75,227,216,.15)] max-[600px]:w-[280px] max-[360px]:w-[235px]" />
        <span className="preview-live absolute left-[13px] top-[13px] flex items-center gap-1.5 border-[1px_solid_rgba(255,255,255,.13)] rounded-[99px] py-[7px] px-[9px] bg-[rgba(5,7,17,.55)] text-[12px] tracking-[.8px] [&_i]:w-[5px] [&_i]:h-[5px] [&_i]:rounded-full [&_i]:bg-[#5be2bf] [&_i]:shadow-[0_0_7px_#5be2bf]">
          <i /> LIVE AUCTION
        </span>
        <button aria-label="Save featured NFT">♡</button>
      </div>
      <div className="preview-content [padding:14px_6px_5px] [&_h3]:my-3.5 [&_h3]:mx-0 [&_h3]:text-[17px] [&>a]:flex [&>a]:h-10 [&>a]:items-center [&>a]:justify-center [&>a]:gap-3 [&>a]:rounded-[11px] [&>a]:bg-[linear-gradient(110deg,#8e6cff,#6749e8)] [&>a]:text-[12px] [&>a]:font-semibold">
        <div className="preview-creator flex items-center gap-2 [&>span]:grid [&>span]:w-[29px] [&>span]:h-[29px] [&>span]:place-items-center [&>span]:rounded-full [&>span]:bg-[linear-gradient(145deg,#efa668,#8858d9)] [&>span]:text-[12px] [&_p]:grid [&_p]:gap-[3px] [&_small]:text-[#647087] [&_small]:text-[12px] [&_strong]:text-[12px] [&_i]:text-[#8c70ed] [&_i]:not-italic [&_b]:ml-auto [&_b]:border-[1px_solid_var(--line)] [&_b]:rounded-1.5 [&_b]:py-1 [&_b]:px-1.5 [&_b]:text-[#798499] [&_b]:text-[12px]">
          <span>AS</span>
          <p>
            <small>Created by</small>
            <strong>
              Aether Studio <i>✓</i>
            </strong>
          </p>
          <b>1 / 1</b>
        </div>
        <h3>Beyond the Horizon</h3>
        <div className="preview-bid flex justify-between border-t-[1px_solid_var(--line)] py-[13px] px-0 [&_p]:grid [&_p]:gap-1 [&_p:last-child]:text-right [&_small]:text-[#636e84] [&_small]:text-[12px] [&_strong]:text-[12px] [&_p:first-child_strong]:text-[#5fe2d6]">
          <p>
            <small>Current bid</small>
            <strong>3.24 ETH</strong>
          </p>
          <p>
            <small>Auction ends in</small>
            <strong>02 : 14 : 38</strong>
          </p>
        </div>
        <Link href="/nft/1">
          View artwork <span>→</span>
        </Link>
      </div>
    </article>
  );
}
