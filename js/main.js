/* ============================================================
   大屏主逻辑：渲染、统计、轮播、地图联动
   ============================================================ */
(function () {
  const CFG = { cycleMs: 8000 };
  let DATA = null, ACTIVE = 0, timer = null;

  /* ---------------- 工具 ---------------- */
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => { const d = document.createElement(tag); if (cls) d.className = cls; if (html != null) d.innerHTML = html; return d; };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const fmt1 = (n) => (Math.round(n * 10) / 10).toFixed(1);

  function countUp(node, to, decimals, suffix) {
    const dur = 1200, t0 = performance.now();
    let done = false;
    (function tick(now) {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      node.textContent = (to * e).toFixed(decimals) + (suffix || '');
      if (k < 1) requestAnimationFrame(tick); else done = true;
    })(t0);
    // 兜底：动画被中断（后台标签页等）时保证最终值正确
    setTimeout(() => { if (!done) node.textContent = to.toFixed(decimals) + (suffix || ''); }, dur + 900);
  }

  /* ---------------- 统计 ---------------- */
  function computeStats(d) {
    const ps = d.projects;
    let totalNodes = 0, doneNodes = 0;
    const byNode = new Map();   // 节点名 -> {done,total}
    const issues = [];
    ps.forEach((p) => {
      p._seq = p.seq;
      p.nodes.forEach((n) => {
        totalNodes++; if (n.done) doneNodes++;
        const k = n.name;
        if (!byNode.has(k)) byNode.set(k, { done: 0, total: 0, order: byNode.size });
        byNode.get(k).total++;
        if (n.done) byNode.get(k).done++;
        if (n.issue) issues.push({ seq: p.seq, short: p.short, node: n.name, text: n.issue });
      });
      // 当前在办节点：第一个未完成且非“待启动”
      p._doing = p.nodes.find((n) => !n.done && n.note && n.note !== '待启动') ||
        p.nodes.find((n) => !n.done) || null;
      p._doneCount = p.nodes.filter((n) => n.done).length;
      p._status = statusOf(p);
    });
    const st = { a: 0, b: 0, c: 0, d: 0 };
    ps.forEach((p) => st[p._status.k]++);
    return { totalNodes, doneNodes, rate: totalNodes ? doneNodes / totalNodes : 0, byNode, issues, st, todoNodes: totalNodes - doneNodes };
  }

  function statusOf(p) {
    const done = (name) => p.nodes.some((n) => n.name.indexOf(name) >= 0 && n.done);
    if (done('入规')) return { k: 'a', t: '已入规' };
    if (done('纳统')) return { k: 'a', t: '已投产' };
    if (done('工程开工') || done('设备进场')) return { k: 'b', t: '建设中' };
    if (done('施工许可')) return { k: 'b', t: '即将开工' };
    if (done('立项备案')) return { k: 'c', t: '前期手续' };
    if (done('投资协议')) return { k: 'd', t: '已签约' };
    return { k: 'd', t: '跟踪中' };
  }

  /* ---------------- 渲染 ---------------- */
  function render(d) {
    DATA = d; const S = computeStats(d);
    $('#parkName').textContent = d.meta.parkName;
    $('#mainTitle').textContent = d.meta.title;
    $('#subTitle').textContent = d.meta.subtitle || '';
    $('#stamp').textContent = '数据来源：' + (d.meta.dataSource || '项目专班清单') + '　数据更新：' + (d.meta.updateTime || '—');

    /* 顶部 KPI */
    const kpis = [
      { c: 'c1', ico: '◈', v: d.projects.length, d: 0, u: '个', l: '专班项目' },
      { c: 'c2', ico: '✔', v: S.doneNodes, d: 0, u: '项', l: '已办结手续' },
      { c: 'c3', ico: '▲', v: S.rate * 100, d: 1, u: '%', l: '手续办结率' },
      { c: 'c4', ico: '!', v: S.issues.length, d: 0, u: '项', l: '需协调问题' }
    ];
    const kr = $('#kpiRow'); kr.innerHTML = '';
    kpis.forEach((k) => {
      const box = el('div', 'kpi ' + k.c);
      box.innerHTML = '<div class="ico">' + k.ico + '</div><div class="txt"><div class="num"><span>0</span><small>' + k.u + '</small></div><div class="lbl">' + k.l + '</div></div>';
      kr.appendChild(box);
      countUp(box.querySelector('.num span'), k.v, k.d);
    });

    /* 项目结构（环形） */
    const rings = $('#rings'); rings.innerHTML = '';
    const ringData = [
      { v: S.st.a, t: '已投产', c: '#18f5b0', max: d.projects.length },
      { v: S.st.b, t: '建设中', c: '#38e6ff', max: d.projects.length },
      { v: S.st.c + S.st.d, t: '前期手续', c: '#ffc42e', max: d.projects.length }
    ];
    ringData.forEach((r) => {
      const pct = r.max ? r.v / r.max : 0, R = 30, C = 2 * Math.PI * R;
      const box = el('div', 'ring');
      box.innerHTML =
        '<svg width="76" height="76">' +
        '<circle cx="38" cy="38" r="' + R + '" stroke="rgba(110,170,220,.18)" stroke-width="6" fill="none"/>' +
        '<circle cx="38" cy="38" r="' + R + '" stroke="' + r.c + '" stroke-width="6" fill="none" stroke-linecap="round"' +
        ' stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '" style="transition:stroke-dashoffset 1.4s cubic-bezier(.2,.8,.3,1);filter:drop-shadow(0 0 5px ' + r.c + ')"/>' +
        '</svg><div class="val"><b>' + r.v + '<small>个</small></b></div><div class="cap">' + r.t + '</div>';
      rings.appendChild(box);
      setTimeout(() => { box.querySelector('circle:last-of-type').setAttribute('stroke-dashoffset', (C * (1 - pct)).toFixed(1)); }, 60);
    });

    /* 手续办理进度 */
    const bars = $('#bars'); bars.innerHTML = '';
    const ORDER = ['投资协议签订', '工商注册', '立项备案', '能评手续', '环评手续', '施工许可证', '工程开工', '纳统'];
    const rows = [];
    ORDER.forEach((nm) => {
      let hit = null;
      for (const [k, v] of S.byNode) { if (k.indexOf(nm) >= 0) { hit = hit ? { done: hit.done + v.done, total: hit.total + v.total } : v; } }
      if (hit) rows.push({ nm, ...hit });
    });
    rows.forEach((r) => {
      const pct = r.total ? r.done / r.total : 0;
      const row = el('div', 'bar-row');
      row.innerHTML = '<span class="nm">' + r.nm + '</span><span class="track"><i class="' + (pct >= 0.99 ? '' : 'warn') + '"></i></span>' +
        '<span class="pc"><b>' + r.done + '</b>/' + r.total + '</span>';
      bars.appendChild(row);
      const fill = row.querySelector('i');
      setTimeout(() => { fill.style.width = (pct * 100).toFixed(1) + '%'; }, 80);
      setTimeout(() => { fill.style.transition = 'none'; fill.style.width = (pct * 100).toFixed(1) + '%'; }, 2600);
    });

    /* 项目名录 */
    const list = $('#listInner'); list.innerHTML = '';
    d.projects.forEach((p, i) => {
      const li = el('div', 'li');
      li.dataset.i = i;
      li.innerHTML = '<span class="no">' + String(p.seq).padStart(2, '0') + '</span><span class="nm" title="' + esc(p.name) + '">' + esc(p.name) + '</span>' +
        '<span class="st ' + p._status.k + '">' + p._status.t + '</span>';
      li.onclick = () => setActive(i, true);
      list.appendChild(li);
    });

    /* 动态卡片 */
    const cw = $('#cardWrap'); cw.innerHTML = '';
    d.projects.forEach((p, i) => {
      const c = el('div', 'card'); c.dataset.i = i;
      const n = p._doing;
      const ph = (p.images && p.images.length)
        ? '<div class="card-photos">' + p.images.slice(0, 2).map((s) => '<img src="' + esc(s) + '" alt="现场照片">').join('') + '</div>'
        : '<div class="card-photos"><div class="ph">项目现场照片 · 待上传</div></div>';
      c.innerHTML =
        '<div class="card-top"><span class="card-seq">' + String(p.seq).padStart(2, '0') + '</span>' +
        '<span class="card-name">' + esc(p.name) + '</span><span class="tag">' + esc(p.tag || '') + '</span></div>' +
        '<div class="card-info">' +
        '<span>投资方</span><b>' + esc(p.investor) + '</b>' +
        '<span>在淮公司</span><b>' + esc(p.company) + '</b>' +
        '<span>联系人</span><b>' + esc(p.contact) + '　' + esc(p.phone) + '</b>' +
        '</div>' +
        (n ? '<div class="node-now"><strong>在办节点 · ' + esc(n.name) + '</strong>　' + esc(n.plan && n.plan !== '—' ? '计划 ' + n.plan : '') + '<br>' +
          esc(n.note || '') + (n.next ? '<br><span style="color:#9fdcff">下周计划：' + esc(n.next) + '</span>' : '') + '</div>' : '') +
        ph;
      cw.appendChild(c);
    });

    /* 问题提示 */
    const iw = $('#issues'); iw.innerHTML = '';
    const iInner = el('div', 'scroll-inner'); iInner.id = 'issuesInner';
    d.projects.forEach((p) => p.nodes.forEach((nd) => {
      if (!nd.issue) return;
      const it = el('div', 'issue');
      it.innerHTML = '<span class="p">' + String(p.seq).padStart(2, '0') + '</span><span><b>' + esc(p.short) + ' · ' + esc(nd.name) + '</b>：' + esc(nd.issue) + '</span>';
      iInner.appendChild(it);
    }));
    if (!iInner.children.length) iInner.appendChild(el('div', 'empty', '暂无需要协调解决的问题'));
    iw.appendChild(iInner);

    /* 跑马灯 */
    const mi = $('#marqueeInner'); mi.innerHTML = '';
    const seqHtml = d.projects.map((p) => '<span><em>' + String(p.seq).padStart(2, '0') + '</em>' + esc(p.name) + '　<b>' + p._status.t + '</b></span>').join('');
    mi.innerHTML = seqHtml + seqHtml;

    setActive(0, false);
    if (timer) clearInterval(timer);
    timer = setInterval(() => setActive((ACTIVE + 1) % d.projects.length, false), CFG.cycleMs);
    autoScroll('#tl', '#tlInner', 0.32);
    autoScroll('#issues', '#issuesInner', 0.26);
  }

  /* ---------------- 联动切换 ---------------- */
  function setActive(i, manual) {
    if (!DATA) return;
    ACTIVE = i;
    const p = DATA.projects[i];
    document.querySelectorAll('.card').forEach((c) => c.classList.toggle('on', +c.dataset.i === i));
    document.querySelectorAll('.li').forEach((c) => c.classList.toggle('on', +c.dataset.i === i));
    scrollListTo(i);
    // 地图上方信息条
    const COLOR = { a: '#18f5b0', b: '#38e6ff', c: '#ffc42e', d: '#9b7bff' }[p._status.k];
    $('#nowBar').innerHTML =
      '<span class="nb-seq">' + String(p.seq).padStart(2, '0') + '</span>' +
      '<span class="nb-name">' + esc(p.name) + '</span>' +
      '<span class="nb-item"><em>投资方</em><b>' + esc(p.investor) + '</b></span>' +
      '<span class="nb-item"><em>联系人</em><b>' + esc(p.contact) + '　' + esc(p.phone) + '</b></span>' +
      '<span class="nb-item"><em>手续办结</em><b>' + p._doneCount + ' / ' + p.nodes.length + ' 项</b></span>' +
      '<span class="nb-st" style="color:' + COLOR + '">' + p._status.t + '</span>';
    renderTimeline(p);
    if (manual) { clearInterval(timer); timer = setInterval(() => setActive((ACTIVE + 1) % DATA.projects.length, false), CFG.cycleMs); }
  }

  /* 专班项目名录：固定 8 行，高亮项超出可视范围时整列上下滚动 */
  const LIST_ROW_H = 37, LIST_VISIBLE = 8;
  function scrollListTo(i) {
    const inner = document.getElementById('listInner');
    if (!inner) return;
    const off = i >= LIST_VISIBLE ? (i - LIST_VISIBLE + 1) * LIST_ROW_H : 0;
    inner.style.transform = 'translateY(' + (-off) + 'px)';
  }

  function renderTimeline(p) {
    const box = $('#tlInner'); box.innerHTML = '';
    p.nodes.forEach((n) => {
      const it = el('div', 'tl-item ' + (n.done ? 'done' : 'undone'));
      it.innerHTML = '<div class="dot"></div><div class="ct"><div class="t1">' + esc(n.name) +
        (n.done ? '　<span style="color:#18f5b0;font-size:11px">已办结</span>' : '　<span style="color:#ffc42e;font-size:11px">在办</span>') +
        '<em>' + esc(n.plan || '—') + '</em></div><div class="t2">' + esc(n.note || '') + (n.next ? '　→ ' + esc(n.next) : '') + '</div></div>';
      box.appendChild(it);
    });
    box.style.transform = 'translateY(0)';
    SCROLLERS.forEach((s) => { if (s.innerSel === '#tlInner') { s.top = 0; s.hold = 260; } });
  }

  /* 面板内容缓慢循环滚动（时间轴 / 问题列表通用） */
  let tlTop = 0, tlHold = 900;
  const SCROLLERS = [];
  function autoScroll(wrapSel, innerSel, speed) {
    if (SCROLLERS.some((s) => s.wrapSel === wrapSel)) return;
    const o = { wrapSel, innerSel, speed, top: 0, hold: 240 };
    SCROLLERS.push(o);
    if (SCROLLERS.length === 1) {
      (function loop() {
        requestAnimationFrame(loop);
        SCROLLERS.forEach((s) => {
          const wrap = document.querySelector(s.wrapSel), inner = document.querySelector(s.innerSel);
          if (!wrap || !inner) return;
          const max = inner.offsetHeight - wrap.clientHeight;
          if (max <= 4) { inner.style.transform = 'translateY(0)'; return; }
          if (s.hold > 0) { s.hold--; return; }
          s.top += s.speed;
          if (s.top >= max + 24) { s.top = 0; s.hold = 90; }
          inner.style.transform = 'translateY(' + (-s.top).toFixed(1) + 'px)';
        });
      })();
    }
  }

  /* ---------------- 时钟 & 自适应 ---------------- */
  function clock() {
    const w = ['日', '一', '二', '三', '四', '五', '六'][new Date().getDay()];
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    $('#clock').textContent = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    $('#clockDate').textContent = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日　星期' + w;
  }
  setInterval(clock, 1000); clock();

  function fit() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    $('#stage').style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', fit); fit();

  /* ---------------- 启动：先本地渲染，再尝试加载远端数据 ---------------- */
  function boot(data) { try { render(data); } catch (e) { console.error(e); } }
  boot(window.CB_DATA);

  // 管理端在同一浏览器保存的数据（用于本地预览）
  try {
    const ls = localStorage.getItem('cb_dashboard_data');
    if (ls) { const j = JSON.parse(ls); if (j && j.projects && j.projects.length) boot(j); }
  } catch (e) { }

  // 线上数据文件 data.json（存在则以它为准）
  fetch('data.json?t=' + Date.now(), { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => { if (j && j.projects && j.projects.length) boot(j); })
    .catch(() => { });
})();
