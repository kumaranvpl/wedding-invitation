const CARD_BG = "#fbf4e6";

async function capture(el) {
  // Heavy libs are loaded on demand so the invitation page stays light.
  const { default: html2canvas } = await import("html2canvas");
  // Fonts must be ready or names render in a fallback face in the snapshot.
  if (document.fonts?.ready) await document.fonts.ready;
  return html2canvas(el, {
    scale: 2,
    backgroundColor: CARD_BG,
    useCORS: true,
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
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}
