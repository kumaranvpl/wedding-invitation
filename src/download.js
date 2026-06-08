const CARD_BG = "#fbf4e6";

// Render at a fixed desktop window width so the exported image is identical on
// every device (big fonts, garland visible) instead of mirroring a cramped
// phone layout. vw units and media queries in the html2canvas clone resolve
// against this width.
const RENDER_WIDTH = 1100;
// Inside that window the card sits at its max-width (640px, var --card-max).
const CARD_WIDTH = 640;
// Scale the 640px card up to a high-res output good enough to survive WhatsApp.
const TARGET_WIDTH = 1920;

async function capture(el) {
  // Heavy libs are loaded on demand so the invitation page stays light.
  const { default: html2canvas } = await import("html2canvas");
  // Fonts must be ready or names render in a fallback face in the snapshot.
  if (document.fonts?.ready) await document.fonts.ready;
  // Wait for decoration images to decode so they aren't skipped in the capture.
  await Promise.all(
    [...el.querySelectorAll("img")].map((img) =>
      img.decode ? img.decode().catch(() => {}) : null,
    ),
  );

  return html2canvas(el, {
    scale: TARGET_WIDTH / CARD_WIDTH, // = 3
    backgroundColor: CARD_BG,
    useCORS: true,
    windowWidth: RENDER_WIDTH,
    windowHeight: 1600,
  });
}

function triggerDownload(href, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = href;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function downloadPng(el, filename) {
  const canvas = await capture(el);
  triggerDownload(canvas.toDataURL("image/png"), filename);
}

export async function downloadPdf(el, filename) {
  const canvas = await capture(el);
  const { jsPDF } = await import("jspdf");
  // Embed a JPEG, not a PNG. A lossless PNG of this ~1920px canvas produces a
  // ~25 MB PDF; JPEG at high quality is a fraction of that with no visible loss
  // on a photo/gradient invitation (and WhatsApp recompresses anyway).
  const img = canvas.toDataURL("image/jpeg", 0.92);
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
    compress: true,
  });
  pdf.addImage(img, "JPEG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
  pdf.save(filename);
}
