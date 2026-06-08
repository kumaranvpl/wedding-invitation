import QRCode from "qrcode";

// Render a QR code for `text` into `target`, replacing its contents.
export async function renderQr(target, text) {
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, text, {
    width: 132,
    margin: 1,
    color: { dark: "#3a2d24", light: "#ffffff" },
  });
  target.replaceChildren(canvas);
  return canvas;
}
