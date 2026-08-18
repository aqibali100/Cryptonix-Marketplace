import Image from "next/image";
import Link from "next/link";
import cryptonixLogo from "../../../public/assets/logo.png";

const footerLinks = [
  {
    title: "Marketplace",
    links: [
      ["Explore NFTs", "/marketplace"],
      ["Top collections", "/#collections"],
      ["Live auctions", "/marketplace"],
      ["Create an NFT", "/create"],
    ],
  },
  {
    title: "Community",
    links: [
      ["Creator profile", "/profile/aether.studio"],
      ["Creator dashboard", "/dashboard"],
      ["Help center", "#"],
      ["Cryptonix blog", "#"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About us", "#"],
      ["Careers", "#"],
      ["Partners", "#"],
      ["Contact", "#"],
    ],
  },
];

const socialLinks = [
  { label: "X (formerly Twitter)", icon: "twitter" },
  { label: "Facebook", icon: "facebook" },
  { label: "Instagram", icon: "instagram" },
  { label: "YouTube", icon: "youtube" },
];

function SocialIcon({ name }: { name: string }) {
  if (name === "twitter") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
        />
      </svg>
    );
  }
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M13.7 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5H17V3.6c-.8-.1-1.6-.2-2.4-.2-2.4 0-4.1 1.5-4.1 4.2v2.3H7.8V13h2.7v8h3.2Z"
        />
      </svg>
    );
  }
  if (name === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.5 7.1a2.8 2.8 0 0 0-2-2C18.8 4.6 12 4.6 12 4.6s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 4.9 2.8 2.8 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-4.9ZM9.8 15.2V8.8l5.6 3.2-5.6 3.2Z"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer relative overflow-hidden border-t border-[var(--line)] bg-[linear-gradient(180deg,#060812,#04050b)]">
      <div className="pointer-events-none absolute -left-44 top-20 h-[400px] w-[400px] rounded-full bg-[rgba(78,214,205,.07)] blur-[100px]" />
      <div className="pointer-events-none absolute -right-36 top-0 h-[450px] w-[450px] rounded-full bg-[rgba(125,87,228,.1)] blur-[100px]" />
      <div className="relative mx-auto w-[min(1180px,calc(100%_-_40px))] max-[600px]:w-[calc(100%_-_28px)]">
        <section className="grid grid-cols-[minmax(230px,.8fr)_minmax(0,1.55fr)] gap-[clamp(48px,8vw,110px)] py-[clamp(48px,7vw,64px)] max-[900px]:grid-cols-1 max-[900px]:gap-12 max-[600px]:gap-10 max-[600px]:py-12 pb-5 pt-10">
          <div className="footer-brand-column">
            <Link
              href="/"
              className="brand inline-flex min-w-0 items-center gap-2.5 text-xl font-[720] leading-none tracking-[-.5px]"
              aria-label="Cryptonix home"
            >
              <Image
                className="block h-13 w-13 shrink-0 object-contain object-center drop-shadow-[0_0_12px_rgba(126,95,255,.55)] max-[420px]:h-11 max-[420px]:w-11"
                src={cryptonixLogo}
                alt=""
                sizes="52px"
                priority
              />
              <span className="-mt-2 inline-flex h-10 items-center text-[25px] max-[420px]:text-[22px]">
                Cryptonix
              </span>
            </Link>
            <p className="mb-6 mt-4 max-w-[300px] text-[12px] leading-6 text-[#657086] max-[900px]:max-w-[520px]">
              The open marketplace for extraordinary digital assets. Collect across chains. Own
              without limits.
            </p>
            <div className="footer-socials flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  className="nav-reflection-link grid h-10 w-10 place-items-center rounded-[11px] border border-[var(--line)] bg-white/[.025] text-[#8994a8] transition hover:-translate-y-0.5 hover:border-[rgba(155,123,255,.35)] hover:bg-[rgba(155,123,255,.08)] hover:text-white hover:shadow-[0_10px_24px_rgba(105,72,235,.18)] focus-visible:border-[rgba(155,123,255,.5)] focus-visible:outline-none [&_svg]:relative [&_svg]:z-[2] [&_svg]:h-[18px] [&_svg]:w-[18px]"
                  href="#"
                  aria-label={social.label}
                  key={social.label}
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <nav
            className="footer-link-groups grid grid-cols-3 gap-x-[clamp(28px,5vw,72px)] gap-y-10 max-[600px]:grid-cols-2 max-[380px]:grid-cols-1"
            aria-label="Footer navigation"
          >
            {footerLinks.map((group) => (
              <div className="flex flex-col items-start gap-1" key={group.title}>
                <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-[1.8px] text-[var(--cyan)]">
                  {group.title}
                </h3>
                {group.links.map(([label, href]) => (
                  <Link
                    className="flex min-h-9 items-center py-1 text-[12px] text-[#778298] transition-colors duration-200 hover:text-[var(--cyan)] focus-visible:text-[var(--cyan)] focus-visible:outline-none"
                    href={href}
                    key={label}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </section>

        <section className="footer-bottom flex min-h-[76px] items-center justify-between gap-6 border-t border-[var(--line)] py-5 text-[12px] text-[#566176] max-[600px]:min-h-0 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-3 max-[600px]:py-6">
          <p className="m-0 leading-5 max-[420px]:max-w-[260px]">
            © 2026 Cryptonix Labs. Built for the open internet.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link className="py-1 transition hover:text-[#a9b2c3]" href="#">
              Privacy
            </Link>
            <Link className="py-1 transition hover:text-[#a9b2c3]" href="#">
              Terms
            </Link>
            <Link className="py-1 transition hover:text-[#a9b2c3]" href="#">
              Cookies
            </Link>
          </div>
        </section>
      </div>
    </footer>
  );
}
