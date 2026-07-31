import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [];
const visit = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) visit(full);
    else if (entry.name.endsWith(".tsx")) files.push(full);
  });
visit(path.join(root, "app"));

const spacing = new Map([
  ["0", "0"],
  ["1px", "px"],
  ["2px", "0.5"],
  ["4px", "1"],
  ["6px", "1.5"],
  ["8px", "2"],
  ["10px", "2.5"],
  ["12px", "3"],
  ["14px", "3.5"],
  ["16px", "4"],
  ["18px", "4.5"],
  ["20px", "5"],
  ["24px", "6"],
  ["28px", "7"],
  ["32px", "8"],
  ["36px", "9"],
  ["40px", "10"],
  ["44px", "11"],
  ["48px", "12"],
  ["52px", "13"],
  ["56px", "14"],
  ["60px", "15"],
  ["64px", "16"],
  ["72px", "18"],
  ["80px", "20"],
  ["96px", "24"],
]);
const len = (value) => {
  if (spacing.has(value)) return spacing.get(value);
  if (value.startsWith("-") && spacing.has(value.slice(1)))
    return `-${spacing.get(value.slice(1))}`;
  return `[${value}]`;
};
const color = (value) =>
  value === "white" || value === "transparent" || value === "inherit" ? value : `[${value}]`;

function convert(prop, value) {
  const direct = {
    "position:relative": "relative",
    "position:absolute": "absolute",
    "position:fixed": "fixed",
    "position:sticky": "sticky",
    "display:flex": "flex",
    "display:grid": "grid",
    "display:block": "block",
    "display:inline-block": "inline-block",
    "display:inline-flex": "inline-flex",
    "display:none": "hidden",
    "align-items:center": "items-center",
    "align-items:flex-start": "items-start",
    "align-items:start": "items-start",
    "align-items:flex-end": "items-end",
    "align-items:end": "items-end",
    "justify-content:center": "justify-center",
    "justify-content:space-between": "justify-between",
    "justify-content:flex-start": "justify-start",
    "justify-content:flex-end": "justify-end",
    "place-items:center": "place-items-center",
    "overflow:hidden": "overflow-hidden",
    "overflow-x:hidden": "overflow-x-hidden",
    "overflow-x:auto": "overflow-x-auto",
    "flex-direction:column": "flex-col",
    "flex-wrap:wrap": "flex-wrap",
    "text-align:center": "text-center",
    "text-align:right": "text-right",
    "text-align:left": "text-left",
    "cursor:pointer": "cursor-pointer",
    "pointer-events:none": "pointer-events-none",
    "font-style:normal": "not-italic",
    "font-style:italic": "italic",
    "text-transform:uppercase": "uppercase",
    "outline:none": "outline-none",
    "resize:vertical": "resize-y",
    "border:0": "border-0",
    "margin:0": "m-0",
    "padding:0": "p-0",
    "width:100%": "w-full",
    "height:100%": "h-full",
    "min-height:100vh": "min-h-screen",
    "border-radius:50%": "rounded-full",
    "border-radius:999px": "rounded-full",
    "margin-left:auto": "ml-auto",
    "margin-right:auto": "mr-auto",
  };
  if (direct[`${prop}:${value}`]) return direct[`${prop}:${value}`];
  if (["top", "right", "bottom", "left", "inset", "gap"].includes(prop))
    return `${prop === "gap" ? "gap" : prop}-${len(value)}`;
  if (prop === "width") return `w-${len(value)}`;
  if (prop === "height") return `h-${len(value)}`;
  if (prop === "min-height") return `min-h-${len(value)}`;
  if (prop === "max-width") return `max-w-${len(value)}`;
  if (prop === "border-radius") return `rounded-${len(value)}`;
  if (prop === "font-size") return `text-${len(value)}`;
  if (prop === "line-height") return `leading-${len(value)}`;
  if (prop === "letter-spacing") return `tracking-${len(value)}`;
  if (prop === "color") return `text-${color(value)}`;
  if (prop === "background" || prop === "background-color") return `bg-${color(value)}`;
  if (prop === "opacity") return `opacity-[${value}]`;
  if (prop === "z-index") return value === "50" ? "z-50" : `z-[${value}]`;
  if (prop === "font-weight")
    return (
      {
        400: "font-normal",
        500: "font-medium",
        600: "font-semibold",
        650: "font-semibold",
        700: "font-bold",
        750: "font-bold",
      }[value] || `font-[${value}]`
    );
  if (prop === "border") return value === "0" ? "border-0" : `border-[${value}]`;
  if (prop === "border-top") return `border-t-[${value}]`;
  if (prop === "border-bottom") return `border-b-[${value}]`;
  if (prop === "border-left") return `border-l-[${value}]`;
  if (prop === "border-block") return `border-y-[${value}]`;
  if (prop === "border-color") return `border-${color(value)}`;
  if (prop === "padding" || prop === "margin") {
    const prefix = prop === "padding" ? "p" : "m";
    const parts = value.split("_");
    if (parts.length === 1) return `${prefix}-${len(parts[0])}`;
    if (parts.length === 2) return `${prefix}y-${len(parts[0])} ${prefix}x-${len(parts[1])}`;
    if (parts.length === 4)
      return `${prefix}t-${len(parts[0])} ${prefix}r-${len(parts[1])} ${prefix}b-${len(parts[2])} ${prefix}l-${len(parts[3])}`;
  }
  if (prop === "padding-top") return `pt-${len(value)}`;
  if (prop === "padding-right") return `pr-${len(value)}`;
  if (prop === "padding-bottom") return `pb-${len(value)}`;
  if (prop === "padding-left") return `pl-${len(value)}`;
  if (prop === "margin-top") return `mt-${len(value)}`;
  if (prop === "margin-right") return `mr-${len(value)}`;
  if (prop === "margin-bottom") return `mb-${len(value)}`;
  if (prop === "margin-left") return `ml-${len(value)}`;
  if (prop === "box-shadow") return `shadow-[${value}]`;
  if (prop === "transform") return `[transform:${value}]`;
  if (prop === "transition") return "transition";
  if (prop === "object-fit")
    return value === "cover"
      ? "object-cover"
      : value === "contain"
        ? "object-contain"
        : `object-[${value}]`;
  if (prop === "flex") return `flex-[${value}]`;
  if (prop === "align-self") return `self-${value.replace("flex-", "")}`;
  if (prop === "grid-template-columns") return `grid-cols-[${value}]`;
  if (prop === "font-family") return value === "inherit" ? "font-[inherit]" : `font-[${value}]`;
  return `[${prop}:${value}]`;
}

for (const file of files) {
  let source = fs.readFileSync(file, "utf8");
  source = source.replace(
    /(?<prefix>(?:(?:hover|focus|focus-within|before|after|max-\[\d+px\]|min-\[\d+px\]|\[&[^\]]+\]):)*)\[(?<prop>-?[a-zA-Z][\w-]*):(?<value>[^\]]+)\]/g,
    (whole, ...args) => {
      const groups = args.at(-1);
      const converted = convert(groups.prop, groups.value);
      return converted
        .split(" ")
        .map((item) => `${groups.prefix}${item}`)
        .join(" ");
    },
  );
  fs.writeFileSync(file, source);
}
console.log(`Normalized Tailwind utilities in ${files.length} files.`);
