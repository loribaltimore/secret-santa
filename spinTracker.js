import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "spinTracker.json");

// ensure file exists
function initFileIfMissing() {
  if (!fs.existsSync(DATA_FILE)) {
    const initState = {
      Ellie: false,
      Dakota: false,
      Brian: false,
      Manny: false,
      Tina: false,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initState, null, 2));
  }
}

export function hasSpun(name) {
  initFileIfMissing();
  const json = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  return Boolean(json[name]);
}

export function markSpun(name) {
  initFileIfMissing();
  const json = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  json[name] = true;
  fs.writeFileSync(DATA_FILE, JSON.stringify(json, null, 2));
};
