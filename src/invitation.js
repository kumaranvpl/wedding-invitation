import { decodeName } from "./encode.js";
import { downloadPdf, downloadPng } from "./download.js";
import { initPetals } from "./petals.js";
import { renderQr } from "./qr.js";

const MAPS_URL = "https://maps.app.goo.gl/LKoMtmw6nNMmhF9T8";
const PNG_NAME = "amrutha-kumaran-wedding-invitation.png";
const PDF_NAME = "amrutha-kumaran-wedding-invitation.pdf";

// --- Personalized greeting (hidden base64 param ?g=) ---
const name = decodeName(new URLSearchParams(location.search).get("g") || "");
document.getElementById("greeting").textContent = name
  ? `Hello ${name},`
  : "Hello,";

// --- Couple photo with floral fallback ---
const photo = document.getElementById("couple-photo");
photo.addEventListener("error", () => {
  const medallion = document.createElement("div");
  medallion.className = "photo photo--fallback";
  medallion.textContent = "🪷";
  photo.replaceWith(medallion);
});
photo.src = `${import.meta.env.BASE_URL}assets/couple.jpg`;

// --- QR to the venue location ---
renderQr(document.getElementById("qr-target"), MAPS_URL);

// --- Petal effect ---
initPetals();

// --- Download menu (bottom-left) ---
const dl = document.getElementById("download");
const card = document.getElementById("invitation-card");
document
  .getElementById("download-toggle")
  .addEventListener("click", () => dl.classList.toggle("open"));
document.addEventListener("click", (e) => {
  if (!dl.contains(e.target)) dl.classList.remove("open");
});
for (const btn of dl.querySelectorAll("[data-format]")) {
  btn.addEventListener("click", async () => {
    dl.classList.remove("open");
    btn.disabled = true;
    try {
      if (btn.dataset.format === "png") await downloadPng(card, PNG_NAME);
      else await downloadPdf(card, PDF_NAME);
    } finally {
      btn.disabled = false;
    }
  });
}
