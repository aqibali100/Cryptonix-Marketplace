import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";

const root = process.cwd();
const cssPath = path.join(root, "app/globals.css");
const css = fs.readFileSync(cssPath, "utf8");
const tree = postcss.parse(css);
const utilities = new Map();

const encode = (value) =>
  value
    .trim()
    .replaceAll("\\", "\\\\")
    .replaceAll("_", "\\_")
    .replace(/\s+/g, "_")
    .replaceAll('"', "'");
const add = (name, utility) => {
  if (!utilities.has(name)) utilities.set(name, []);
  const list = utilities.get(name);
  if (!list.includes(utility)) list.push(utility);
};

for (const rule of tree.nodes.flatMap(function walk(node) {
  const result = [];
  if (node.type === "rule") result.push(node);
  if ((node.nodes && node.type !== "atrule") || (node.type === "atrule" && node.name === "media")) {
    for (const child of node.nodes || []) result.push(...walk(child));
  }
  return result;
})) {
  let media = "";
  let parent = rule.parent;
  while (parent) {
    if (parent.type === "atrule" && parent.name === "media") {
      const max = parent.params.match(/max-width:\s*(\d+)px/);
      const min = parent.params.match(/min-width:\s*(\d+)px/);
      if (max) media = `max-[${max[1]}px]:${media}`;
      else if (min) media = `min-[${min[1]}px]:${media}`;
    }
    parent = parent.parent;
  }

  for (const selector of rule.selectors || []) {
    const match = selector.trim().match(/^\.([a-zA-Z_][\w-]*)(.*)$/);
    if (!match) continue;
    const [, className, rawSuffix] = match;
    const descendant = /^\s/.test(rawSuffix);
    let suffix = rawSuffix.trim();
    let variant = media;
    if (suffix === ":hover") variant += "hover:";
    else if (suffix === ":focus" || suffix === ":focus-within") variant += `${suffix.slice(1)}:`;
    else if (suffix === "::before") variant += "before:";
    else if (suffix === "::after") variant += "after:";
    else if (suffix) {
      const normalized = `${descendant ? "_" : ""}${suffix
        .replace(new RegExp(`^\\.${className}`), `.${className}`)
        .replace(/\s+/g, "_")
        .replaceAll('"', "'")}`;
      variant += `[&${normalized}]:`;
    }
    for (const declaration of rule.nodes || []) {
      if (declaration.type !== "decl") continue;
      add(
        className,
        `${variant}[${declaration.prop}:${encode(declaration.value)}${declaration.important ? "!important" : ""}]`,
      );
    }
  }
}

const files = [];
const visit = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(full);
    else if (entry.name.endsWith(".tsx")) files.push(full);
  }
};
visit(path.join(root, "app"));

const used = new Set();
for (const file of files) {
  let source = fs.readFileSync(file, "utf8");
  source = source.replace(
    /className=(\{)?("[^"]*"|`[^`]*`)(\})?/g,
    (whole, open = "", quoted, close = "") => {
      const quote = quoted[0];
      let value = quoted.slice(1, -1);
      const originalTokens = value.split(/\s+/).filter(Boolean);
      const additions = [];
      for (const token of originalTokens) {
        const clean = token.replace(/^\$\{.*$/, "");
        const rules = utilities.get(clean);
        if (!rules) continue;
        used.add(clean);
        additions.push(...rules);
      }
      if (!additions.length) return whole;
      value += ` ${[...new Set(additions)].join(" ")}`;
      return `className=${open}${quote}${value}${quote}${close}`;
    },
  );
  fs.writeFileSync(file, source);
}

const baseNodes = tree.nodes.filter((node) => {
  if (node.type === "atrule" && (node.name === "import" || node.name === "theme")) return true;
  if (node.type !== "rule") return false;
  return node.selectors?.every((selector) => !selector.trim().startsWith("."));
});
const output = baseNodes.map((node) => node.toString()).join("\n\n") + "\n";
fs.writeFileSync(cssPath, output);

const missing = [...utilities.keys()].filter((name) => !used.has(name));
console.log(`Migrated ${used.size} component classes across ${files.length} files.`);
console.log(`Unmatched component classes: ${missing.join(", ") || "none"}`);
