// Ambient petal fall + click-burst from the cursor, drawn on a full-page canvas
// overlay. The overlay never intercepts clicks and is not part of the card, so
// it never appears in downloads. Honors prefers-reduced-motion.

const COLORS = ["#ec86b1", "#d65f93", "#f6b73c", "#f3d06b"];
const AMBIENT_MAX = 26; // calm density
const BURST_COUNT = 16;

function makePetal(x, y, burst) {
  const angle = burst ? Math.random() * Math.PI * 2 : Math.PI / 2;
  const speed = burst ? 2 + Math.random() * 4 : 0.6 + Math.random() * 0.9;
  return {
    x,
    y,
    vx: burst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 0.6,
    vy: burst ? Math.sin(angle) * speed - 1 : speed,
    size: 7 + Math.random() * 7,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.12,
    sway: Math.random() * Math.PI * 2,
    color: COLORS[(Math.random() * COLORS.length) | 0],
    burst,
  };
}

function drawPetal(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function initPetals() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.id = "petal-overlay";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let w = 0;
  let h = 0;
  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  const petals = [];

  window.addEventListener("pointerdown", (e) => {
    for (let i = 0; i < BURST_COUNT; i++) {
      petals.push(makePetal(e.clientX, e.clientY, true));
    }
  });

  let frame = 0;
  function tick() {
    frame++;
    // Spawn ambient petals slowly while under the cap.
    const ambient = petals.filter((p) => !p.burst).length;
    if (ambient < AMBIENT_MAX && frame % 8 === 0) {
      petals.push(makePetal(Math.random() * w, -12, false));
    }

    ctx.clearRect(0, 0, w, h);
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.sway += 0.03;
      p.x += p.vx + Math.sin(p.sway) * 0.5;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.burst) p.vy += 0.08; // gravity on bursts
      drawPetal(ctx, p);
      if (p.y > h + 24 || p.x < -40 || p.x > w + 40) petals.splice(i, 1);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
