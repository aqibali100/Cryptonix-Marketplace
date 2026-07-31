import type { Metadata } from "next";
import PermissionGuard from "../components/auth/PermissionGuard";

export const metadata: Metadata = {
  title: "Create an NFT — Cryptonix",
  description: "Mint your next digital masterpiece on Cryptonix.",
};

export default function CreatePage() {
  return (
    <PermissionGuard permission="nft:create">
      <main className="create-page page-shell [padding:155px_0_110px] max-[600px]:pt-[125px] w-[min(1180px,_calc(100%_-_40px))] [margin-inline:auto] max-[600px]:w-[min(100%_-_28px,_1180px)]">
        <div className="create-heading max-w-[760px] text-center [margin:0_auto_55px] [&_h1]:text-[clamp(46px,6vw,70px)] [&_h1]:[margin:12px_0_20px] [&_p]:text-[#8893a8] [&_p]:text-sm max-[600px]:text-left max-[600px]:mb-[35px] max-[600px]:[&_h1]:text-[43px] max-[600px]:[&_h1]:tracking-[-2.5px]">
          <span className="section-kicker text-[var(--cyan)] text-[12px] font-bold tracking-[2px]">
            CREATE ON CRYPTONIX
          </span>
          <h1 className="max-w-[690px] m-0 text-[clamp(48px,5.6vw,76px)] font-[620] tracking-[-4.6px] leading-[.99] [&_span]:bg-[linear-gradient(100deg,#b49dff_12%,#6deee0_100%)] [&_span]:bg-clip-text [&_span]:text-transparent">
            Turn your vision into a <span>digital asset.</span>
          </h1>
          <p>Upload your work, define its story, and choose how collectors can own it.</p>
        </div>
        <div className="create-layout grid grid-cols-[minmax(0,1fr)_350px] gap-[25px] items-start max-[900px]:grid-cols-[1fr]">
          <form className="create-form glass rounded-3xl p-7 max-[600px]:p-4.5 border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]">
            <div className="form-section-title flex items-start gap-3 [margin:5px_0_20px] [&>span]:grid [&>span]:w-[29px] [&>span]:h-[29px] [&>span]:place-items-center [&>span]:border-[1px_solid_rgba(155,123,255,.25)] [&>span]:rounded-[9px] [&>span]:bg-[rgba(155,123,255,.08)] [&>span]:text-[#a993fa] [&>span]:text-[12px] [&_h2]:text-[17px] [&_h2]:tracking-[-.4px] [&_p]:mt-1 [&_p]:text-[#687388] [&_p]:text-[12px]">
              <span>01</span>
              <div>
                <h2 className="mt-[7px] mb-0 text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
                  Upload your creation
                </h2>
                <p>PNG, GIF, WEBP, MP4 or MP3. Max 100 MB.</p>
              </div>
            </div>
            <label className="upload-zone grid h-[210px] mb-[35px] place-items-center [align-content:center] gap-[7px] border-[1px_dashed_rgba(155,123,255,.35)] rounded-[17px] bg-[rgba(155,123,255,.035)] cursor-pointer [&_input]:hidden [&_strong]:text-[12px] [&_small]:text-[#687388] [&_small]:text-[12px] [&_i]:mt-1.5 [&_i]:border-[1px_solid_var(--line)] [&_i]:rounded-2 [&_i]:py-[7px] [&_i]:px-[11px] [&_i]:text-[#a1aabd] [&_i]:text-[12px] [&_i]:not-italic">
              <input type="file" />
              <span className="upload-icon grid w-[42px] h-[42px] mb-[5px] place-items-center rounded-[13px] bg-[rgba(155,123,255,.12)] text-[#b29cff] text-xl">
                ↑
              </span>
              <strong>Drop your file here</strong>
              <small>or click to browse from your device</small>
              <i>Choose file</i>
            </label>
            <div className="form-section-title flex items-start gap-3 [margin:5px_0_20px] [&>span]:grid [&>span]:w-[29px] [&>span]:h-[29px] [&>span]:place-items-center [&>span]:border-[1px_solid_rgba(155,123,255,.25)] [&>span]:rounded-[9px] [&>span]:bg-[rgba(155,123,255,.08)] [&>span]:text-[#a993fa] [&>span]:text-[12px] [&_h2]:text-[17px] [&_h2]:tracking-[-.4px] [&_p]:mt-1 [&_p]:text-[#687388] [&_p]:text-[12px]">
              <span>02</span>
              <div>
                <h2 className="mt-[7px] mb-0 text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
                  Asset details
                </h2>
                <p>Give collectors the story behind your work.</p>
              </div>
            </div>
            <label className="field grid gap-2 mb-4 [&>span]:text-[#a8b0c0] [&>span]:text-[12px] [&>span_i]:text-[#a47cff] [&_input]:w-full [&_input]:border-[1px_solid_var(--line)] [&_input]:rounded-[11px] [&_input]:[outline:0] [&_input]:py-0 [&_input]:px-3 [&_input]:bg-[#0d1120] [&_input]:text-white [&_input]:text-[12px] [&_textarea]:w-full [&_textarea]:border-[1px_solid_var(--line)] [&_textarea]:rounded-[11px] [&_textarea]:[outline:0] [&_textarea]:py-0 [&_textarea]:px-3 [&_textarea]:bg-[#0d1120] [&_textarea]:text-white [&_textarea]:text-[12px] [&_select]:w-full [&_select]:border-[1px_solid_var(--line)] [&_select]:rounded-[11px] [&_select]:[outline:0] [&_select]:py-0 [&_select]:px-3 [&_select]:bg-[#0d1120] [&_select]:text-white [&_select]:text-[12px] [&_input]:h-[43px] [&_select]:h-[43px] [&_textarea]:h-[105px] [&_textarea]:pt-3 [&_textarea]:resize-y [&>small]:mt-[-3px] [&>small]:text-[#566176] [&>small]:text-[12px]">
              <span>
                Name <i>*</i>
              </span>
              <input placeholder="e.g. Beyond the Horizon" />
            </label>
            <label className="field grid gap-2 mb-4 [&>span]:text-[#a8b0c0] [&>span]:text-[12px] [&>span_i]:text-[#a47cff] [&_input]:w-full [&_input]:border-[1px_solid_var(--line)] [&_input]:rounded-[11px] [&_input]:[outline:0] [&_input]:py-0 [&_input]:px-3 [&_input]:bg-[#0d1120] [&_input]:text-white [&_input]:text-[12px] [&_textarea]:w-full [&_textarea]:border-[1px_solid_var(--line)] [&_textarea]:rounded-[11px] [&_textarea]:[outline:0] [&_textarea]:py-0 [&_textarea]:px-3 [&_textarea]:bg-[#0d1120] [&_textarea]:text-white [&_textarea]:text-[12px] [&_select]:w-full [&_select]:border-[1px_solid_var(--line)] [&_select]:rounded-[11px] [&_select]:[outline:0] [&_select]:py-0 [&_select]:px-3 [&_select]:bg-[#0d1120] [&_select]:text-white [&_select]:text-[12px] [&_input]:h-[43px] [&_select]:h-[43px] [&_textarea]:h-[105px] [&_textarea]:pt-3 [&_textarea]:resize-y [&>small]:mt-[-3px] [&>small]:text-[#566176] [&>small]:text-[12px]">
              <span>Description</span>
              <textarea placeholder="Tell the story behind your creation..." />
              <small>Markdown is supported</small>
            </label>
            <div className="form-row grid grid-cols-[1fr_1fr] gap-3 max-[600px]:grid-cols-[1fr]">
              <label className="field grid gap-2 mb-4 [&>span]:text-[#a8b0c0] [&>span]:text-[12px] [&>span_i]:text-[#a47cff] [&_input]:w-full [&_input]:border-[1px_solid_var(--line)] [&_input]:rounded-[11px] [&_input]:[outline:0] [&_input]:py-0 [&_input]:px-3 [&_input]:bg-[#0d1120] [&_input]:text-white [&_input]:text-[12px] [&_textarea]:w-full [&_textarea]:border-[1px_solid_var(--line)] [&_textarea]:rounded-[11px] [&_textarea]:[outline:0] [&_textarea]:py-0 [&_textarea]:px-3 [&_textarea]:bg-[#0d1120] [&_textarea]:text-white [&_textarea]:text-[12px] [&_select]:w-full [&_select]:border-[1px_solid_var(--line)] [&_select]:rounded-[11px] [&_select]:[outline:0] [&_select]:py-0 [&_select]:px-3 [&_select]:bg-[#0d1120] [&_select]:text-white [&_select]:text-[12px] [&_input]:h-[43px] [&_select]:h-[43px] [&_textarea]:h-[105px] [&_textarea]:pt-3 [&_textarea]:resize-y [&>small]:mt-[-3px] [&>small]:text-[#566176] [&>small]:text-[12px]">
                <span>Collection</span>
                <select defaultValue="">
                  <option value="" disabled>
                    Select collection
                  </option>
                  <option>Aether Dimensions</option>
                  <option>Uncategorized</option>
                </select>
              </label>
              <label className="field grid gap-2 mb-4 [&>span]:text-[#a8b0c0] [&>span]:text-[12px] [&>span_i]:text-[#a47cff] [&_input]:w-full [&_input]:border-[1px_solid_var(--line)] [&_input]:rounded-[11px] [&_input]:[outline:0] [&_input]:py-0 [&_input]:px-3 [&_input]:bg-[#0d1120] [&_input]:text-white [&_input]:text-[12px] [&_textarea]:w-full [&_textarea]:border-[1px_solid_var(--line)] [&_textarea]:rounded-[11px] [&_textarea]:[outline:0] [&_textarea]:py-0 [&_textarea]:px-3 [&_textarea]:bg-[#0d1120] [&_textarea]:text-white [&_textarea]:text-[12px] [&_select]:w-full [&_select]:border-[1px_solid_var(--line)] [&_select]:rounded-[11px] [&_select]:[outline:0] [&_select]:py-0 [&_select]:px-3 [&_select]:bg-[#0d1120] [&_select]:text-white [&_select]:text-[12px] [&_input]:h-[43px] [&_select]:h-[43px] [&_textarea]:h-[105px] [&_textarea]:pt-3 [&_textarea]:resize-y [&>small]:mt-[-3px] [&>small]:text-[#566176] [&>small]:text-[12px]">
                <span>Supply</span>
                <input type="number" defaultValue="1" min="1" />
              </label>
            </div>
            <div className="form-section-title flex items-start gap-3 [margin:5px_0_20px] [&>span]:grid [&>span]:w-[29px] [&>span]:h-[29px] [&>span]:place-items-center [&>span]:border-[1px_solid_rgba(155,123,255,.25)] [&>span]:rounded-[9px] [&>span]:bg-[rgba(155,123,255,.08)] [&>span]:text-[#a993fa] [&>span]:text-[12px] [&_h2]:text-[17px] [&_h2]:tracking-[-.4px] [&_p]:mt-1 [&_p]:text-[#687388] [&_p]:text-[12px]">
              <span>03</span>
              <div>
                <h2 className="mt-[7px] mb-0 text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
                  Choose listing type
                </h2>
                <p>Select how your asset will enter the market.</p>
              </div>
            </div>
            <div className="listing-options grid grid-cols-[1fr_1fr] gap-2.5 mb-5 [&_label]:relative [&_label]:grid [&_label]:gap-[5px] [&_label]:border-[1px_solid_var(--line)] [&_label]:rounded-[13px] [&_label]:p-[15px] [&_label]:cursor-pointer [&_label:has(input:checked)]:border-[rgba(155,123,255,.5)] [&_label:has(input:checked)]:bg-[rgba(155,123,255,.07)] [&_input]:absolute [&_input]:right-3 [&_input]:top-3 [&_input]:[accent-color:#8d6cff] [&_span]:text-lg [&_span]:text-[#a38bfa] [&_strong]:text-[12px] [&_small]:text-[#687388] [&_small]:text-[12px] max-[600px]:grid-cols-[1fr]">
              <label>
                <input type="radio" name="listing" defaultChecked />
                <span>◈</span>
                <strong>Fixed price</strong>
                <small>Sell instantly at your chosen price</small>
              </label>
              <label>
                <input type="radio" name="listing" />
                <span>◷</span>
                <strong>Timed auction</strong>
                <small>Let collectors compete for it</small>
              </label>
            </div>
            <div className="form-row grid grid-cols-[1fr_1fr] gap-3 max-[600px]:grid-cols-[1fr]">
              <label className="field grid gap-2 mb-4 [&>span]:text-[#a8b0c0] [&>span]:text-[12px] [&>span_i]:text-[#a47cff] [&_input]:w-full [&_input]:border-[1px_solid_var(--line)] [&_input]:rounded-[11px] [&_input]:[outline:0] [&_input]:py-0 [&_input]:px-3 [&_input]:bg-[#0d1120] [&_input]:text-white [&_input]:text-[12px] [&_textarea]:w-full [&_textarea]:border-[1px_solid_var(--line)] [&_textarea]:rounded-[11px] [&_textarea]:[outline:0] [&_textarea]:py-0 [&_textarea]:px-3 [&_textarea]:bg-[#0d1120] [&_textarea]:text-white [&_textarea]:text-[12px] [&_select]:w-full [&_select]:border-[1px_solid_var(--line)] [&_select]:rounded-[11px] [&_select]:[outline:0] [&_select]:py-0 [&_select]:px-3 [&_select]:bg-[#0d1120] [&_select]:text-white [&_select]:text-[12px] [&_input]:h-[43px] [&_select]:h-[43px] [&_textarea]:h-[105px] [&_textarea]:pt-3 [&_textarea]:resize-y [&>small]:mt-[-3px] [&>small]:text-[#566176] [&>small]:text-[12px]">
                <span>Price</span>
                <div className="unit-input w-full border-[1px_solid_var(--line)] rounded-[11px] [outline:0] py-0 px-3 bg-[#0d1120] text-white text-[12px] flex items-center pr-3 [&_input]:border-0 [&_input]:p-0 [&_input]:bg-transparent [&_b]:text-[12px]">
                  <input defaultValue="1.00" />
                  <b>ETH</b>
                </div>
              </label>
              <label className="field grid gap-2 mb-4 [&>span]:text-[#a8b0c0] [&>span]:text-[12px] [&>span_i]:text-[#a47cff] [&_input]:w-full [&_input]:border-[1px_solid_var(--line)] [&_input]:rounded-[11px] [&_input]:[outline:0] [&_input]:py-0 [&_input]:px-3 [&_input]:bg-[#0d1120] [&_input]:text-white [&_input]:text-[12px] [&_textarea]:w-full [&_textarea]:border-[1px_solid_var(--line)] [&_textarea]:rounded-[11px] [&_textarea]:[outline:0] [&_textarea]:py-0 [&_textarea]:px-3 [&_textarea]:bg-[#0d1120] [&_textarea]:text-white [&_textarea]:text-[12px] [&_select]:w-full [&_select]:border-[1px_solid_var(--line)] [&_select]:rounded-[11px] [&_select]:[outline:0] [&_select]:py-0 [&_select]:px-3 [&_select]:bg-[#0d1120] [&_select]:text-white [&_select]:text-[12px] [&_input]:h-[43px] [&_select]:h-[43px] [&_textarea]:h-[105px] [&_textarea]:pt-3 [&_textarea]:resize-y [&>small]:mt-[-3px] [&>small]:text-[#566176] [&>small]:text-[12px]">
                <span>Blockchain</span>
                <select>
                  <option>Ethereum</option>
                  <option>Base</option>
                  <option>Polygon</option>
                </select>
              </label>
            </div>
            <button
              className="create-submit flex w-full h-[50px] items-center justify-center gap-[15px] mt-[9px] border-0 rounded-[13px] bg-[linear-gradient(110deg,#906dff,#6547e8)] text-[12px] font-semibold cursor-pointer"
              type="button"
            >
              Create digital asset <span>→</span>
            </button>
          </form>
          <aside className="create-preview sticky top-[120px] [&>span]:block [&>span]:mt-0 [&>span]:mr-0 [&>span]:mb-2.5 [&>span]:ml-[5px] [&>span]:text-[#6f7a8f] [&>span]:text-[12px] [&>span]:tracking-[1.3px] max-[900px]:[position:static] max-[900px]:grid max-[900px]:grid-cols-[1fr_1fr] max-[900px]:gap-3 max-[900px]:[&>span]:[grid-column:1/-1] max-[600px]:grid-cols-[1fr]">
            <span>LIVE PREVIEW</span>
            <div className="preview-card glass rounded-[21px] p-[11px] border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]">
              <div className="preview-empty grid h-[330px] place-items-center [align-content:center] gap-[7px] rounded-[15px] bg-[radial-gradient(circle_at_50%_40%,rgba(146,105,255,.15),transparent_27%),linear-gradient(145deg,#101628,#17122f)] [&_i]:text-[#8e73ef] [&_i]:text-[28px] [&_i]:not-italic [&_strong]:text-[12px] [&_small]:text-[#626d83] [&_small]:text-[12px]">
                <i>✦</i>
                <strong>Your artwork appears here</strong>
                <small>Upload a file to see its preview</small>
              </div>
              <div className="preview-meta flex justify-between [padding:14px_5px_5px] [&>span]:grid [&>span]:gap-1 [&>span:last-child]:text-right [&_small]:text-[#687388] [&_small]:text-[12px] [&_strong]:text-[12px]">
                <span>
                  <small>Untitled</small>
                  <strong>By you</strong>
                </span>
                <span>
                  <small>Price</small>
                  <strong>1.00 ETH</strong>
                </span>
              </div>
            </div>
            <div className="creator-tip glass flex gap-[11px] mt-3 rounded-[14px] p-3.5 [&>span]:text-[#62dfd5] [&_p]:grid [&_p]:gap-[5px] [&_strong]:text-[12px] [&_small]:text-[#6f7a8f] [&_small]:text-[12px] [&_small]:leading-[1.5] border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]">
              <span>✦</span>
              <p>
                <strong>Creator tip</strong>
                <small>Assets with a thoughtful story are 2.4× more likely to sell.</small>
              </p>
            </div>
          </aside>
        </div>
      </main>
    </PermissionGuard>
  );
}
