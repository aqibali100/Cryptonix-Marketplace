import Link from "next/link";
import FloatingCards from "./FloatingCards";
import NFTPreview from "./NFTPreview";

export default function HeroSection() {
  return (
    <section className="landing-hero page-shell relative mx-auto grid min-h-[722px] w-[min(1180px,calc(100%_-_40px))] grid-cols-[minmax(0,1.02fr)_minmax(0,.98fr)] items-center gap-[65px] overflow-hidden pb-15 pt-[140px] max-[1050px]:gap-8 max-[900px]:grid-cols-[minmax(0,1fr)] max-[900px]:overflow-visible max-[900px]:pt-[160px] max-[900px]:text-center max-[900px]:[&_.hero-actions]:justify-center max-[900px]:[&_.hero-trust]:justify-center max-[600px]:min-h-[auto] max-[600px]:w-[calc(100%_-_28px)] max-[600px]:pt-[125px] max-[600px]:gap-[30px] max-[600px]:[&_.hero-actions]:grid">
      <div className="hero-grid-glow absolute z-[-1] right-[-20%] top-[10%] w-[70%] h-[75%] opacity-[.16] [background-image:linear-gradient(rgba(158,129,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(158,129,255,.16)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(circle,#000,transparent_70%)] [transform:perspective(500px)_rotateY(-20deg)]" />
      <div className="landing-hero-copy relative z-[3] min-w-0 max-[900px]:mx-auto max-[900px]:w-full max-[900px]:[&_h1]:mx-auto [&_h1]:text-[clamp(48px,6.3vw,82px)] [&_h1]:leading-[.95] [&>p]:max-w-[585px] [&>p]:[margin:27px_0_32px] [&>p]:text-[#929db1] [&>p]:text-base [&>p]:leading-[1.75] max-[900px]:[&>p]:[margin-inline:auto] max-[600px]:[&_h1]:text-[clamp(36px,12vw,48px)] max-[600px]:[&_h1]:tracking-[-2.6px] max-[600px]:[&>p]:text-sm max-[360px]:[&_h1]:text-[34px] max-[360px]:[&_h1]:tracking-[-2.2px]">
        <div className="eyebrow inline-flex items-center gap-[9px] mb-6 border-[1px_solid_rgba(155,123,255,.22)] rounded-full py-2 px-[13px] bg-[rgba(155,123,255,.07)] text-[#c5b7ff] text-[12px] font-semibold tracking-[1.3px] uppercase [&_span]:w-1.5 [&_span]:h-1.5 [&_span]:rounded-[99px] [&_span]:bg-[var(--cyan)] [&_span]:shadow-[0_0_10px_var(--cyan)] max-[900px]:[margin-inline:auto] max-[600px]:mb-[19px] max-[600px]:text-[12px]">
          <span /> Discover rare digital assets
        </div>
        <h1 className="max-w-[690px] m-0 text-[clamp(48px,5.6vw,76px)] font-[620] tracking-[-4.6px] leading-[.99] [&_span]:bg-[linear-gradient(100deg,#b49dff_12%,#6deee0_100%)] [&_span]:bg-clip-text [&_span]:text-transparent">
          Where Digital
          <br />
          Assets
          <br />
          <span>Become Yours</span>
        </h1>
        <p>Discover, collect, and trade unique NFTs and crypto assets all in one marketplace.</p>
        <div className="hero-actions flex flex-wrap gap-3 max-[900px]:justify-center max-[600px]:grid max-[600px]:[&_a]:w-full">
          <Link
            className="primary-button hover:[transform:translateY(-2px)] hover:shadow-[0_14px_34px_rgba(105,72,235,.42)] inline-flex min-h-13 items-center justify-center gap-[15px] rounded-[15px] py-0 px-[21px] text-sm font-semibold transition bg-[linear-gradient(110deg,_#8e6cff,_#6649eb)] shadow-[0_12px_35px_rgba(105,72,235,.28)]"
            href="/marketplace"
          >
            Explore marketplace
          </Link>
        </div>
        <div className="hero-trust flex items-center gap-3 mt-[49px] [&>p]:grid [&>p]:gap-[3px] [&_strong]:text-[12px] [&_span]:text-[#626d82] [&_span]:text-[12px] max-[600px]:flex-wrap">
          <div className="trust-avatars flex [&_i]:grid [&_i]:w-[29px] [&_i]:h-[29px] [&_i]:ml-[-7px] [&_i]:place-items-center [&_i]:border-[2px_solid_#080a15] [&_i]:rounded-full [&_i]:bg-[linear-gradient(145deg,#9a73e9,#40c7be)] [&_i]:text-[12px] [&_i]:not-italic [&_i:first-child]:m-0 [&_i:nth-child(2)]:bg-[linear-gradient(145deg,#eb9b62,#bb4b8b)] [&_i:nth-child(3)]:bg-[linear-gradient(145deg,#5e9fe7,#4a4aba)] [&_i:last-child]:bg-[#161a2a] [&_i:last-child]:text-[#8a95a9]">
            <i>A</i>
            <i>N</i>
            <i>V</i>
            <i>+</i>
          </div>
          <p>
            <strong>12,000+</strong>
            <span>collectors joined this month</span>
          </p>
          <div className="trust-rating ml-2.5 border-l-[1px_solid_var(--line)] pl-4.5 text-[#9b7dff] text-[12px] tracking-[1px] [&_span]:ml-[5px] [&_span]:text-[#b5bdcd] [&_span]:tracking-0 max-[600px]:hidden">
            ★★★★★ <span>4.9</span>
          </div>
        </div>
      </div>
      <div className="landing-hero-art relative grid min-h-[630px] min-w-0 place-items-center max-[900px]:min-h-[600px] max-[600px]:min-h-[510px] max-[360px]:min-h-[470px]">
        <NFTPreview />
        <FloatingCards />
      </div>
    </section>
  );
}
