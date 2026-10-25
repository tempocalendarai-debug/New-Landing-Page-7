import { readFile, writeFile } from "node:fs/promises";
import QRCode from "qrcode";

const { url } = JSON.parse(await readFile(new URL("../src/content/app-store.json", import.meta.url), "utf8"));
const svg = await QRCode.toString(url, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 4,
  width: 168,
  color: { dark: "#1b1b19", light: "#ffffff" },
});
await writeFile(new URL("../public/assets/download-qr.svg", import.meta.url), svg);
