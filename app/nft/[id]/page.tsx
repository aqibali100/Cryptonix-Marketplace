import type { Metadata } from "next";
import Link from "next/link";
import AuctionPanel from "../../components/auction/AuctionPanel";

export const metadata: Metadata = {
  title: "Beyond the Horizon — Cryptonix",
  description: "View and bid on a rare digital artwork by Aether Studio.",
};

export default async function NftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="detail-page page-shell pt-[138px] max-[600px]:pt-[110px] w-[min(1180px,_calc(100%_-_40px))] [margin-inline:auto] max-[600px]:w-[min(100%_-_28px,_1180px)]">
      <div className="detail-breadcrumb flex gap-2 mb-6 text-[#606b80] text-[12px] [&_a:hover]:text-white [&_strong]:text-[#a3adc0]">
        <Link href="/marketplace">Marketplace</Link>
        <span>/</span>
        <Link href="/marketplace">Digital Art</Link>
        <span>/</span>
        <strong>#{id}</strong>
      </div>
      <div className="detail-layout grid grid-cols-[1.05fr_.95fr] gap-13 items-start max-[900px]:grid-cols-[1fr] max-[600px]:gap-[30px]">
        <section className="detail-art-column sticky top-[120px] max-[900px]:[position:static]">
          <div className="detail-art glass relative rounded-[26px] p-3 border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]">
            <div className="detail-cosmos relative grid h-[570px] overflow-hidden place-items-center rounded-[19px] bg-[radial-gradient(circle_at_25%_20%,rgba(78,225,214,.4),transparent_2%),radial-gradient(circle_at_75%_74%,rgba(190,111,255,.4),transparent_2%),radial-gradient(circle_at_50%_48%,#5c3d9d,transparent_30%),linear-gradient(145deg,#0e2340,#181139_60%,#30204b)] [&>i]:absolute [&>i]:w-[3px] [&>i]:h-[3px] [&>i]:rounded-full [&>i]:bg-white [&>i]:shadow-[40px_70px_white,-100px_35px_#60eadf,145px_-75px_#bc87ff,190px_85px_white,-180px_-100px_white] [&>i:nth-child(3)]:[transform:rotate(55deg)_translateX(180px)] [&>i:nth-child(4)]:[transform:rotate(145deg)_translateX(230px)] [&>i:nth-child(5)]:[transform:rotate(240deg)_translateX(150px)] max-[900px]:h-[520px] max-[600px]:h-[390px]">
              <div className="detail-planet z-[2] w-[245px] h-[245px] rounded-full bg-[radial-gradient(circle_at_30%_25%,#f6e2ff,#ad83e5_20%,#503775_55%,#141638_80%)] shadow-[inset_-38px_-25px_50px_rgba(3,5,18,.7),0_0_100px_rgba(143,91,224,.48)]" />
              <div className="detail-ring absolute z-[3] w-[450px] h-[95px] border-[2px_solid_rgba(166,144,255,.5)] rounded-full [transform:rotate(-18deg)] shadow-[0_0_28px_rgba(68,220,211,.18)]" />
              <i />
              <i />
              <i />
            </div>
            <button
              className="detail-expand absolute z-[4] right-[25px] top-[25px] grid w-[38px] h-[38px] place-items-center border-[1px_solid_rgba(255,255,255,.15)] rounded-[11px] bg-[rgba(5,7,17,.5)] cursor-pointer"
              aria-label="Expand artwork"
            >
              ↗
            </button>
            <span className="detail-edition absolute z-[4] left-[26px] bottom-[25px] border-[1px_solid_rgba(255,255,255,.12)] rounded-[99px] py-[7px] px-2.5 bg-[rgba(5,7,17,.55)] text-[#c8cfdd] text-[12px] tracking-[1px]">
              1 / 1 EDITION
            </span>
          </div>
          <div className="detail-utility flex justify-center gap-2 mt-2.5 [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[#657087] [&_button]:text-[12px] [&_button]:cursor-pointer">
            <button>◇ View on IPFS</button>
            <button>◈ View contract</button>
            <button>↗ Share</button>
          </div>
        </section>

        <section className="detail-info [&>h1]:mt-[13px] [&>h1]:text-[clamp(44px,5vw,68px)]">
          <div className="detail-label flex items-center justify-between [&>span]:text-[#a893fa] [&>span]:text-[12px] [&>span]:font-semibold [&>span]:tracking-[1.4px] [&_button]:border-[1px_solid_var(--line)] [&_button]:rounded-[99px] [&_button]:py-[7px] [&_button]:px-2.5 [&_button]:bg-[rgba(255,255,255,.03)] [&_button]:text-[#9da7bb] [&_button]:text-[12px]">
            <span>✦ FEATURED ARTWORK</span>
            <button>♡ 284</button>
          </div>
          <h1 className="max-w-[690px] m-0 text-[clamp(48px,5.6vw,76px)] font-[620] tracking-[-4.6px] leading-[.99] [&_span]:bg-[linear-gradient(100deg,#b49dff_12%,#6deee0_100%)] [&_span]:bg-clip-text [&_span]:text-transparent">
            Beyond the <span>Horizon</span>
          </h1>
          <div className="detail-owner-row flex gap-9 my-7 mx-0 max-[600px]:gap-3.5 max-[600px]:justify-between">
            <div className="detail-person flex items-center gap-[9px] [&_p]:grid [&_p]:gap-1 [&_small]:text-[#687389] [&_small]:text-[12px] [&_strong]:text-[12px] [&_i]:[display:inline-grid] [&_i]:w-3 [&_i]:h-3 [&_i]:place-items-center [&_i]:rounded-full [&_i]:bg-[#735be4] [&_i]:text-[12px] [&_i]:not-italic">
              <span className="person-avatar creator grid w-[37px] h-[37px] place-items-center rounded-full text-[12px] font-bold [&.creator]:bg-[linear-gradient(145deg,#f2b677,#8e60ec)] [&.owner]:bg-[linear-gradient(145deg,#4edbd0,#345aad)]">
                A
              </span>
              <p>
                <small>Created by</small>
                <strong>
                  @aether.studio <i>✓</i>
                </strong>
              </p>
            </div>
            <div className="detail-person flex items-center gap-[9px] [&_p]:grid [&_p]:gap-1 [&_small]:text-[#687389] [&_small]:text-[12px] [&_strong]:text-[12px] [&_i]:[display:inline-grid] [&_i]:w-3 [&_i]:h-3 [&_i]:place-items-center [&_i]:rounded-full [&_i]:bg-[#735be4] [&_i]:text-[12px] [&_i]:not-italic">
              <span className="person-avatar owner grid w-[37px] h-[37px] place-items-center rounded-full text-[12px] font-bold [&.creator]:bg-[linear-gradient(145deg,#f2b677,#8e60ec)] [&.owner]:bg-[linear-gradient(145deg,#4edbd0,#345aad)]">
                N
              </span>
              <p>
                <small>Owned by</small>
                <strong>nova.collector</strong>
              </p>
            </div>
          </div>
          <p className="detail-description text-[#8a95aa] text-xs leading-[1.8]">
            A journey beyond the edge of the known universe, where light fractures into possibility.
            This generative piece combines spatial algorithms with hand-shaped color fields to
            create a singular cosmic landscape.
          </p>
          <div className="detail-properties grid grid-cols-[repeat(3,1fr)] gap-2 my-5 mx-0 [&>span]:grid [&>span]:gap-[5px] [&>span]:border-[1px_solid_var(--line)] [&>span]:rounded-[11px] [&>span]:p-[11px] [&>span]:bg-[rgba(255,255,255,.025)] [&_small]:text-[#677287] [&_small]:text-[12px] [&_strong]:text-[12px] max-[600px]:grid-cols-[1fr]">
            <span>
              <small>Blockchain</small>
              <strong>Ethereum</strong>
            </span>
            <span>
              <small>Token standard</small>
              <strong>ERC-721</strong>
            </span>
            <span>
              <small>Royalties</small>
              <strong>5%</strong>
            </span>
          </div>
          <AuctionPanel />
        </section>
      </div>
      <section className="more-collection py-[100px] px-0">
        <div className="section-heading flex items-end justify-between mb-7 [&_>_a]:text-[#a9b2c5] [&_>_a]:text-[13px] [&_>_a_span]:ml-2 [&_>_a_span]:text-[var(--cyan)] max-[600px]:items-start max-[600px]:[&_>_a]:text-0 max-[600px]:[&_>_a_span]:text-xl">
          <div>
            <span className="section-kicker text-[var(--cyan)] text-[12px] font-bold tracking-[2px]">
              MORE FROM THE COLLECTION
            </span>
            <h2 className="mt-[7px] mb-0 text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
              Aether Dimensions
            </h2>
          </div>
          <Link href="/marketplace">
            View collection <span>→</span>
          </Link>
        </div>
        <div className="mini-nft-grid grid grid-cols-[repeat(3,1fr)] gap-[15px] max-[600px]:grid-cols-[1fr]">
          {["Echo Chamber", "Parallel Light", "Infinite Bloom"].map((name, index) => (
            <Link
              href={`/nft/${index + 2}`}
              className={`mini-nft mini-${index} overflow-hidden border-[1px_solid_var(--line)] rounded-[17px] bg-[rgba(255,255,255,.025)] [&>div]:h-[150px] [&>div]:bg-[radial-gradient(circle,#8b66d6,transparent_28%),linear-gradient(145deg,#13233c,#211440)] [&.mini-1>div]:bg-[radial-gradient(circle,#5de1d3,transparent_25%),linear-gradient(145deg,#11383e,#1a183e)] [&.mini-2>div]:bg-[radial-gradient(circle,#db76b5,transparent_25%),linear-gradient(145deg,#40203e,#151a34)] [&>span]:flex [&>span]:justify-between [&>span]:p-[13px] [&>span]:text-[12px] [&_small]:text-[#5be0d4] max-[600px]:[&:nth-child(3)]:hidden`}
              key={name}
            >
              <div />
              <span>
                <strong>{name}</strong>
                <small>{(1.3 + index * 0.7).toFixed(2)} ETH</small>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
