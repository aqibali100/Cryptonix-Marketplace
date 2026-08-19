"use client";

import { useState } from "react";

const bids = [
  { user: "0x71F...8A2", amount: "3.24 ETH", time: "2 min ago", mark: "7" },
  { user: "nova.collector", amount: "3.08 ETH", time: "18 min ago", mark: "N" },
  { user: "0x24C...91E", amount: "2.91 ETH", time: "42 min ago", mark: "2" },
];

export default function AuctionPanel() {
  const [tab, setTab] = useState<"bids" | "activity">("bids");
  const [bid, setBid] = useState("3.30");

  return (
    <aside className="auction-panel glass rounded-[21px] p-[19px] border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]">
      <div className="auction-status flex items-center gap-2 text-[#7f8a9f] text-[12px] [&_strong]:ml-auto [&_strong]:text-[#cdd3df]">
        <span className="pulse-dot inline-block w-[7px] h-[7px] rounded-full bg-[#59e5be] shadow-[0_0_10px_rgba(89,229,190,.75)]" />{" "}
        Live auction <strong>Ends in 02:14:38</strong>
      </div>
      <div className="auction-current grid gap-1 my-[22px] mx-0 [&_span]:text-[#6c778d] [&_span]:text-[12px] [&_small]:text-[#6c778d] [&_small]:text-[12px] [&_strong]:text-[31px] [&_strong]:tracking--px">
        <span>Current bid</span>
        <strong>3.24 ETH</strong>
        <small>≈ $8,146.22 USD</small>
      </div>
      <div className="auction-input-label flex justify-between mb-[7px] text-[#7b869b] text-[12px]">
        <span>Your bid</span>
        <small>Balance: 8.42 ETH</small>
      </div>
      <label className="bid-input flex h-[46px] items-center border-[1px_solid_var(--line)] rounded-xl py-0 px-[13px] bg-[rgba(255,255,255,.025)] focus-within:border-[rgba(155,123,255,.5)] [&_input]:flex-[1] [&_input]:border-0 [&_input]:[outline:0] [&_input]:bg-transparent [&_input]:text-white [&_input]:text-sm [&_span]:text-[#a6afc1] [&_span]:text-[12px] [&_span]:font-semibold">
        <input
          value={bid}
          onChange={(event) => setBid(event.target.value)}
          inputMode="decimal"
          aria-label="Your bid amount"
        />
        <span>ETH</span>
      </label>
      <button className="user-primary-action place-bid-large mt-2.5 w-full">
        Place a bid <span>→</span>
      </button>
      <div className="auction-note text-center [margin:10px_0_16px] text-[#59647a] text-[12px]">
        ◈ Service fee 2.5% · Creator royalty 5%
      </div>
      <div className="bid-tabs flex border-b-[1px_solid_var(--line)] [&_button]:border-0 [&_button]:border-b-[2px_solid_transparent] [&_button]:py-2.5 [&_button]:px-[15px] [&_button]:bg-transparent [&_button]:text-[#6d788e] [&_button]:text-[12px] [&_button]:cursor-pointer [&_button.active]:border-[#9173f5] [&_button.active]:text-white">
        <button className={tab === "bids" ? "active" : ""} onClick={() => setTab("bids")}>
          Bid history
        </button>
        <button className={tab === "activity" ? "active" : ""} onClick={() => setTab("activity")}>
          Activity
        </button>
      </div>
      <div className="bid-list [&>div]:flex [&>div]:items-center [&>div]:gap-[9px] [&>div]:border-b-[1px_solid_rgba(255,255,255,.05)] [&>div]:py-[11px] [&>div]:px-0.5 [&_p]:grid [&_p]:gap-[3px] [&_p_strong]:text-[12px] [&_p_small]:text-[#5f6a80] [&_p_small]:text-[12px] [&_b]:ml-auto [&_b]:text-[12px] [&_.activity-note]:text-[#788399] [&_.activity-note]:text-[12px] [&_.activity-note]:leading-[1.7]">
        {tab === "bids" ? (
          bids.map((item) => (
            <div key={item.user}>
              <span className="bid-avatar grid w-7 h-7 place-items-center rounded-full bg-[linear-gradient(145deg,#694ad0,#36ada9)] text-[12px]">
                {item.mark}
              </span>
              <p>
                <strong>{item.user}</strong>
                <small>{item.time}</small>
              </p>
              <b>{item.amount}</b>
            </div>
          ))
        ) : (
          <div className="activity-note">
            This asset was listed for auction 6 hours ago and has gained 124 views.
          </div>
        )}
      </div>
    </aside>
  );
}
