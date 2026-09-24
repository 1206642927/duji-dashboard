/* 精细粒子层（性能优化版）
   1) 空间网格加速近邻连线，避免 O(n²) 全量比对
   2) 预渲染光点贴图，避免每帧创建 radialGradient
   3) 背景层固定 30fps，稳定流畅、CPU 占用低
*/
(function () {
  const cv = document.getElementById('particles');
  if (!cv) return;
  const ctx = cv.getContext('2d', { alpha: true });
  const W = cv.width = 1920, H = cv.height = 1080;
  const LINK = 172, LINK2 = LINK * LINK;
  const FPS = 30, FRAME = 1000 / FPS;
  const COLORS = ['150,230,255', '110,190,255', '120,255,220', '190,225,255'];

  /* ---- 预渲染光点贴图 ---- */
  function sprite(rgb, size) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grd.addColorStop(0, 'rgba(' + rgb + ',1)');
    grd.addColorStop(0.35, 'rgba(' + rgb + ',0.45)');
    grd.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = grd;
    g.beginPath(); g.arc(size / 2, size / 2, size / 2, 0, 6.2832); g.fill();
    return c;
  }
  const SPR = {}, DUST = {};
  for (const c of COLORS) { SPR[c] = sprite(c, 16); DUST[c] = sprite(c, 64); }

  let dots = [], dust = [], t = 0, last = 0;
  const GX = Math.ceil(W / LINK), GY = Math.ceil(H / LINK);
  const buckets = new Array(GX * GY);

  function init() {
    dots = [];
    for (let i = 0; i < 120; i++) {
      dots.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.24, vy: (Math.random() - 0.5) * 0.24,
        r: Math.random() * 1.1 + 0.5,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        a: Math.random() * 0.3 + 0.5,
        ph: Math.random() * 6.28
      });
    }
    dust = [];
    for (let i = 0; i < 22; i++) {
      dust.push({
        x: Math.random() * W, y: Math.random() * H,
        v: Math.random() * 0.3 + 0.12,
        r: Math.random() * 0.9 + 0.7,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        a: Math.random() * 0.3 + 0.22
      });
    }
  }

  function step(now) {
    requestAnimationFrame(step);
    if (now - last < FRAME) return;      // 固定 30fps
    last = now;
    t++;

    ctx.clearRect(0, 0, W, H);

    /* 分桶 */
    buckets.fill(null);
    for (const d of dots) {
      const gx = (d.x / LINK) | 0, gy = (d.y / LINK) | 0;
      const k = gy * GX + gx;
      (buckets[k] || (buckets[k] = [])).push(d);
    }

    /* 连线：只查同格与右/下相邻格 */
    ctx.lineWidth = 0.6;
    const NB = [[0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    for (let gy = 0; gy < GY; gy++) {
      for (let gx = 0; gx < GX; gx++) {
        const A = buckets[gy * GX + gx];
        if (!A) continue;
        for (let n = 0; n < NB.length; n++) {
          const nx = gx + NB[n][0], ny = gy + NB[n][1];
          if (nx < 0 || ny < 0 || nx >= GX || ny >= GY) continue;
          const B = buckets[ny * GX + nx];
          if (!B) continue;
          const same = (n === 0);
          for (let i = 0; i < A.length; i++) {
            const a = A[i];
            for (let j = same ? i + 1 : 0; j < B.length; j++) {
              const b = B[j];
              const dx = a.x - b.x, dy = a.y - b.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < LINK2) {
                const k = 1 - d2 / LINK2;
                ctx.strokeStyle = 'rgba(' + a.c + ',' + (k * k * 0.26).toFixed(3) + ')';
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
              }
            }
          }
        }
      }
    }

    /* 微粒 */
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < -8) d.x = W + 8; else if (d.x > W + 8) d.x = -8;
      if (d.y < -8) d.y = H + 8; else if (d.y > H + 8) d.y = -8;
      const tw = 0.72 + 0.28 * Math.sin(t * 0.045 + d.ph);
      const s = d.r * 8;   // 贴图直径（核 + 光晕）
      ctx.globalAlpha = d.a * tw;
      ctx.drawImage(SPR[d.c], d.x - s / 2, d.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;

    /* 柔光浮尘 */
    for (const s of dust) {
      s.y -= s.v;
      s.x += Math.sin((t + s.y) * 0.006) * 0.2;
      if (s.y < -20) { s.y = H + 20; s.x = Math.random() * W; }
      const sz = s.r * 46;
      ctx.globalAlpha = s.a;
      ctx.drawImage(DUST[s.c], s.x - sz / 2, s.y - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;
  }

  init();
  requestAnimationFrame(step);
})();
