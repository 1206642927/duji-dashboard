/* 粒子星链背景：漂浮粒子 + 邻近连线 + 缓慢上浮光点 */
(function () {
  const cv = document.getElementById('particles');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width = 1920, H = cv.height = 1080;
  const COLORS = ['56,230,255', '43,140,255', '24,245,176'];
  let dots = [], sparks = [], raf = null, t = 0;

  function init() {
    dots = [];
    const n = Math.round(W * H / 26000); // ≈ 80 个
    for (let i = 0; i < n; i++) {
      dots.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.7 + 0.6,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        a: Math.random() * 0.5 + 0.35
      });
    }
    sparks = [];
    for (let i = 0; i < 26; i++) {
      sparks.push({ x: Math.random() * W, y: Math.random() * H, v: Math.random() * 0.5 + 0.25, r: Math.random() * 1.4 + 0.5 });
    }
  }

  function step() {
    t++;
    ctx.clearRect(0, 0, W, H);

    // 连线
    for (let i = 0; i < dots.length; i++) {
      const a = dots[i];
      for (let j = i + 1; j < dots.length; j++) {
        const b = dots[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 26000) {
          const al = (1 - d2 / 26000) * 0.28;
          ctx.strokeStyle = 'rgba(' + a.c + ',' + al.toFixed(3) + ')';
          ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }

    // 粒子
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < -10) d.x = W + 10; if (d.x > W + 10) d.x = -10;
      if (d.y < -10) d.y = H + 10; if (d.y > H + 10) d.y = -10;
      const tw = 0.72 + 0.28 * Math.sin((t + d.x) * 0.03);
      ctx.fillStyle = 'rgba(' + d.c + ',' + (d.a * tw).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.2832); ctx.fill();
    }

    // 上浮光点
    for (const s of sparks) {
      s.y -= s.v;
      if (s.y < -10) { s.y = H + 10; s.x = Math.random() * W; }
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 7);
      g.addColorStop(0, 'rgba(120,235,255,.55)');
      g.addColorStop(1, 'rgba(120,235,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 7, 0, 6.2832); ctx.fill();
    }

    raf = requestAnimationFrame(step);
  }

  init();
  step();
  window.addEventListener('resize', () => { /* 画布尺寸固定 1920×1080，由 #stage 缩放 */ });
})();
