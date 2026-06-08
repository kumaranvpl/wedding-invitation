import garlandUrl from "./decor/garland.svg";
import lotusUrl from "./decor/lotus.svg";
import { decodeName } from "./encode.js";
import { downloadPdf, downloadPng } from "./download.js";
import { initPetals } from "./petals.js";
import { renderQr } from "./qr.js";

// --- Decorations (as <img> so they survive the html2canvas export) ---
document.getElementById("lotus-tl").src = lotusUrl;
document.getElementById("lotus-br").src = lotusUrl;
document.getElementById("garland").src = garlandUrl;

const MAPS_URL = "https://maps.app.goo.gl/LKoMtmw6nNMmhF9T8";
const PNG_NAME = "amrutha-kumaran-wedding-invitation.png";
const PDF_NAME = "amrutha-kumaran-wedding-invitation.pdf";

// --- Personalized greeting (hidden base64 param ?g=) ---
const name = decodeName(new URLSearchParams(location.search).get("g") || "");
document.getElementById("greeting").textContent = name
  ? `Hello ${name},`
  : "Hello,";

// --- Couple photo with floral fallback ---
// Set as a background-image (not an <img>) so cover-cropping survives the
// html2canvas export — object-fit on <img> is ignored there and stretches it.
const photo = document.getElementById("couple-photo");
const photoSrc = `${import.meta.env.BASE_URL}assets/couple.jpg`;
const probe = new Image();
probe.onload = () => {
  photo.style.backgroundImage = `url("${photoSrc}")`;
};
probe.onerror = () => {
  photo.classList.add("photo--fallback");
  photo.textContent = "🪷";
};
probe.src = photoSrc;

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
