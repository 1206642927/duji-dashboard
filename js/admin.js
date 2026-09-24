/* ============================================================
   管理端逻辑：编辑项目 / 节点 / 照片 / 地图点位，导出或发布
   ============================================================ */
let DATA = null, CUR = 0;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LS_KEY = 'cb_dashboard_data';
const LS_CFG = 'cb_admin_cfg';

function toast(msg, ms) {
  const t = $('#toast'); t.textContent = msg; t.style.display = 'block';
  clearTimeout(t._h); t._h = setTimeout(() => { t.style.display = 'none'; }, ms || 2600);
}

/* ---------------- 口令 ---------------- */
function cbUnlock() {
  const cfg = JSON.parse(localStorage.getItem(LS_CFG) || '{}');
  const right = cfg.pwd || 'duji2026';
  if ($('#pwd').value.trim() === right || !right) { $('#lock').style.display = 'none'; boot(); }
  else toast('口令不正确');
}
document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && $('#lock').style.display !== 'none') cbUnlock(); });
function cbSetPwd() {
  const cfg = JSON.parse(localStorage.getItem(LS_CFG) || '{}');
  const v = prompt('设置新的操作口令（留空则取消口令）', cfg.pwd || 'duji2026');
  if (v === null) return;
  cfg.pwd = v.trim(); localStorage.setItem(LS_CFG, JSON.stringify(cfg)); toast('口令已更新');
}

/* ---------------- 载入 ---------------- */
function boot() {
  DATA = null;
  try { const ls = localStorage.getItem(LS_KEY); if (ls) DATA = JSON.parse(ls); } catch (e) { }
  if (!DATA) {
    fetch('data.json?t=' + Date.now()).then((r) => (r.ok ? r.json() : null)).then((j) => {
      DATA = (j && j.projects) ? j : JSON.parse(JSON.stringify(window.CB_DATA));
      afterLoad();
    }).catch(() => { DATA = JSON.parse(JSON.stringify(window.CB_DATA)); afterLoad(); });
  } else afterLoad();
}
function afterLoad() {
  if (!DATA.meta) DATA.meta = {};
  if (!DATA.projects) DATA.projects = [];
  CUR = 0; renderList(); renderEditor();
}

/* ---------------- 项目列表 ---------------- */
function renderList() {
  const box = $('#plist'); box.innerHTML = '';
  DATA.projects.forEach((p, i) => {
    const d = document.createElement('div');
    d.className = 'pitem' + (i === CUR ? ' on' : '');
    const done = p.nodes.filter((n) => n.done).length;
    d.innerHTML = '<span class="no">' + String(i + 1).padStart(2, '0') + '</span><span class="nm">' + esc(p.short || p.name) + '</span>' +
      '<span class="tip">' + done + '/' + p.nodes.length + '</span>';
    d.onclick = () => { CUR = i; renderList(); renderEditor(); };
    box.appendChild(d);
  });
}

/* ---------------- 编辑表单 ---------------- */
function f(label, id, val, type) {
  return '<div><label>' + label + '</label><input id="' + id + '" type="' + (type || 'text') + '" value="' + esc(val || '') + '"></div>';
}
function ta(label, id, val) {
  return '<div><label>' + label + '</label><textarea id="' + id + '" rows="2">' + esc(val || '') + '</textarea></div>';
}

function renderEditor() {
  const box = $('#editor');
  if (!DATA.projects.length) { box.innerHTML = '<div class="panel"><div class="bd tip">暂无项目，点击左侧「新增项目」开始。</div></div>'; return; }
  const p = DATA.projects[CUR];
  if (!p.nodes) p.nodes = [];
  if (!p.images) p.images = [];
  if (!p.pos) p.pos = { x: 50, y: 50 };

  let h = '';
  h += '<div class="panel"><h3>① 基础信息</h3><div class="bd">';
  h += '<div class="row r4">' + f('序号', 'f_seq', p.seq, 'number') + f('简称（地图标注）', 'f_short', p.short) + f('产业标签', 'f_tag', p.tag) + f('状态（留空自动判断）', 'f_status', p.status) + '</div>';
  h += '<div class="row">' + f('项目名称（全称）', 'f_name', p.name) + '</div>';
  h += '<div class="row r2">' + f('投资方', 'f_investor', p.investor) + f('在淮注册公司', 'f_company', p.company) + '</div>';
  h += '<div class="row r2">' + f('项目联系人', 'f_contact', p.contact) + f('联系电话', 'f_phone', p.phone) + '</div>';
  h += '</div></div>';

  /* 地图点位 */
  h += '<div class="panel" style="margin-top:14px;"><h3>② 地图点位（在地图上点击即可定位本项目）</h3><div class="bd">';
  h += '<div class="map-pick" id="mapPick" style="background-image:url(images/land-use-map.png)"></div>';
  h += '<p class="tip" style="margin-top:8px;">当前点位：X <b id="posX">' + p.pos.x + '</b>%　Y <b id="posY">' + p.pos.y + '</b>%　（灰点为其他项目，蓝点为当前项目）</p>';
  h += '</div></div>';

  /* 节点 */
  h += '<div class="panel" style="margin-top:14px;"><h3>③ 手续节点（共 ' + p.nodes.length + ' 项，已办结 ' + p.nodes.filter((n) => n.done).length + ' 项）</h3><div class="bd" id="nodes"></div>';
  h += '<div class="bd flex"><button class="mini" onclick="cbAddNode()">＋ 新增节点</button><span class="tip">节点顺序即大屏时间轴显示顺序</span></div></div>';

  /* 照片 */
  h += '<div class="panel" style="margin-top:14px;"><h3>④ 项目现场照片（大屏循环展示，建议 2—3 张）</h3><div class="bd">';
  h += '<div class="photos" id="photos"></div>';
  h += '<div class="flex" style="margin-top:10px;"><input type="file" id="phFile" accept="image/*" multiple style="display:none;">';
  h += '<button class="mini" onclick="document.getElementById(\'phFile\').click()">＋ 上传照片</button>';
  h += '<span class="tip">照片会自动压缩后存入数据文件；如使用代码托管平台发布，请控制总大小在 5MB 以内。</span></div>';
  h += '</div></div>';

  /* 元信息 */
  h += '<div class="panel" style="margin-top:14px;"><h3>⑤ 平台标题与数据信息</h3><div class="bd">';
  h += '<div class="row r2">' + f('园区名称', 'm_park', DATA.meta.parkName) + f('平台标题', 'm_title', DATA.meta.title) + '</div>';
  h += '<div class="row">' + f('副标题', 'm_sub', DATA.meta.subtitle) + '</div>';
  h += '<div class="row r2">' + f('数据更新时间', 'm_update', DATA.meta.updateTime) + f('数据来源说明', 'm_source', DATA.meta.dataSource) + '</div>';
  h += '<hr><div class="flex"><button class="mini" onclick="cbSetPwd()">修改操作口令</button><button class="mini" onclick="cbReset()">恢复初始数据</button></div>';
  h += '</div></div>';

  box.innerHTML = h;

  /* 绑定基础字段 */
  const bind = (id, key, num) => {
    const n = $('#' + id); if (!n) return;
    n.oninput = () => { p[key] = num ? (parseInt(n.value, 10) || 0) : n.value; renderList(); };
  };
  bind('f_seq', 'seq', true); bind('f_short', 'short'); bind('f_tag', 'tag'); bind('f_status', 'status');
  bind('f_name', 'name'); bind('f_investor', 'investor'); bind('f_company', 'company');
  bind('f_contact', 'contact'); bind('f_phone', 'phone');

  const mb = (id, key) => { const n = $('#' + id); if (n) n.oninput = () => { DATA.meta[key] = n.value; }; };
  mb('m_park', 'parkName'); mb('m_title', 'title'); mb('m_sub', 'subtitle'); mb('m_update', 'updateTime'); mb('m_source', 'dataSource');

  renderNodes(); renderPhotos(); bindMapPick();
}

/* ---------------- 节点 ---------------- */
const NODE_TPL = ['投资协议签订', '工商注册', '立项备案', '能评手续', '环评手续', '施工许可证', '工程开工', '厂房装修', '工程竣工', '设备进场、安装调试', '纳统', '入规'];
function renderNodes() {
  const p = DATA.projects[CUR], box = $('#nodes'); box.innerHTML = '';
  p.nodes.forEach((n, i) => {
    const d = document.createElement('div'); d.className = 'node';
    d.innerHTML =
      '<div class="nh"><b>' + String(i + 1).padStart(2, '0') + '</b>' +
      '<select data-k="name" style="width:220px">' + NODE_TPL.map((t) => '<option' + (t === n.name ? ' selected' : '') + '>' + t + '</option>').join('') + '</select>' +
      '<input data-k="name2" placeholder="或自定义名称" value="' + esc(NODE_TPL.indexOf(n.name) >= 0 ? '' : n.name) + '" style="width:200px">' +
      '<label class="chk"><input type="checkbox" data-k="done"' + (n.done ? ' checked' : '') + '>已办结</label>' +
      '<span class="sp"></span><button class="mini" data-a="up">↑</button><button class="mini" data-a="down">↓</button><button class="mini danger" data-a="del">删除</button></div>' +
      '<div class="row r3"><div><label>计划完成日期</label><input data-k="plan" value="' + esc(n.plan || '') + '" placeholder="如 2026年9月30日"></div>' +
      '<div><label>责任部门</label><input data-k="dept" value="' + esc(n.dept || '') + '"></div>' +
      '<div><label>负责人 / 电话</label><input data-k="staff" value="' + esc(n.staff || '') + '"></div></div>' +
      '<div class="row r2"><div><label>进展情况</label><textarea data-k="note" rows="2">' + esc(n.note || '') + '</textarea></div>' +
      '<div><label>下周推进计划</label><textarea data-k="next" rows="2">' + esc(n.next || '') + '</textarea></div></div>' +
      '<div><label>需协调解决的问题（填写后会出现在大屏“需协调解决问题”栏）</label><input data-k="issue" value="' + esc(n.issue || '') + '"></div>';
    box.appendChild(d);
    d.querySelectorAll('[data-k]').forEach((inp) => {
      const k = inp.dataset.k;
      const ev = inp.tagName === 'SELECT' || inp.type === 'checkbox' ? 'change' : 'input';
      inp.addEventListener(ev, () => {
        if (k === 'done') n.done = inp.checked;
        else if (k === 'name') { if (NODE_TPL.indexOf(inp.value) >= 0) n.name = inp.value; }
        else if (k === 'name2') { if (inp.value.trim()) n.name = inp.value.trim(); }
        else n[k] = inp.value;
        if (k === 'done') { renderList(); d.querySelector('.nh b').style.color = n.done ? '#7dffc4' : '#cfeaff'; }
        if (k === 'name' || k === 'name2') { renderList(); }
      });
    });
    d.querySelector('[data-a="up"]').onclick = () => { if (i > 0) { const a = p.nodes; [a[i - 1], a[i]] = [a[i], a[i - 1]]; renderNodes(); } };
    d.querySelector('[data-a="down"]').onclick = () => { const a = p.nodes; if (i < a.length - 1) { [a[i + 1], a[i]] = [a[i], a[i + 1]]; renderNodes(); } };
    d.querySelector('[data-a="del"]').onclick = () => { if (confirm('确定删除该节点？')) { p.nodes.splice(i, 1); renderNodes(); renderList(); } };
  });
  // 更新标题计数
  const t = box.parentElement.querySelector('h3');
  if (t) t.textContent = '③ 手续节点（共 ' + p.nodes.length + ' 项，已办结 ' + p.nodes.filter((n) => n.done).length + ' 项）';
  const sel = box.querySelector('select');
  if (sel && !p.nodes.length) box.innerHTML = '<p class="tip">暂无节点，点击下方「新增节点」添加。</p>';
}
function cbAddNode() {
  const p = DATA.projects[CUR];
  p.nodes.push({ name: '能评手续', plan: '', done: false, note: '', next: '', dept: '', staff: '', issue: '' });
  renderNodes(); renderList();
}

/* ---------------- 照片 ---------------- */
function renderPhotos() {
  const p = DATA.projects[CUR], box = $('#photos'); box.innerHTML = '';
  if (!p.images.length) box.innerHTML = '<p class="tip">尚未上传照片，大屏将显示占位框。</p>';
  p.images.forEach((src, i) => {
    const d = document.createElement('div'); d.className = 'photo';
    d.innerHTML = '<img src="' + src + '"><button>×</button>';
    d.querySelector('button').onclick = () => { p.images.splice(i, 1); renderPhotos(); };
    box.appendChild(d);
  });
  const fi = $('#phFile');
  if (fi) fi.onchange = () => handleFiles(fi.files);
}
function handleFiles(files) {
  const p = DATA.projects[CUR];
  [...files].forEach((file) => {
    if (!/^image\//.test(file.type)) return;
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = () => {
        const maxW = 1000, sc = Math.min(1, maxW / im.width);
        const c = document.createElement('canvas');
        c.width = Math.round(im.width * sc); c.height = Math.round(im.height * sc);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        p.images.push(c.toDataURL('image/jpeg', 0.72));
        renderPhotos();
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
  toast('照片已加入，记得保存');
}

/* ---------------- 地图点位 ---------------- */
function bindMapPick() {
  const box = $('#mapPick'); if (!box) return;
  box.innerHTML = '';
  const p = DATA.projects[CUR];
  /* 背景图按 contain 显示，需按图片实际比例反算百分比 */
  const img = new Image();
  img.onload = () => {
    const ratio = img.width / img.height;
    const bw = box.clientWidth, bh = box.clientHeight;
    const w = Math.min(bw, bh * ratio), h = w / ratio;
    const ox = (bw - w) / 2, oy = (bh - h) / 2;
    box.dataset.o = [ox, oy, w, h].join(',');
    DATA.projects.forEach((q, i) => {
      const d = document.createElement('div');
      d.className = 'mk' + (i === CUR ? '' : ' other');
      d.style.left = (ox + q.pos.x / 100 * w) + 'px';
      d.style.top = (oy + q.pos.y / 100 * h) + 'px';
      if (i !== CUR) d.title = q.short;
      box.appendChild(d);
    });
    box.onclick = (e) => {
      const r = box.getBoundingClientRect();
      const [a, b, ww, hh] = box.dataset.o.split(',').map(Number);
      let x = ((e.clientX - r.left - a) / ww) * 100, y = ((e.clientY - r.top - b) / hh) * 100;
      x = Math.max(0, Math.min(100, x)); y = Math.max(0, Math.min(100, y));
      p.pos = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
      $('#posX').textContent = p.pos.x; $('#posY').textContent = p.pos.y;
      bindMapPick();
    };
  };
  img.src = 'images/land-use-map.png';
}

/* ---------------- 保存 / 导出 / 导入 ---------------- */
function cbSaveLocal() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(DATA));
    toast('已保存到本机浏览器。打开大屏（本机）即可看到更新；如需更新线上大屏，请点「导出 data.json」后上传到仓库。', 5200);
  } catch (e) { toast('保存失败：' + e.message); }
}
function cbReset() {
  if (!confirm('恢复为初始数据（将丢弃当前修改，浏览器内的修改也会清除）？')) return;
  localStorage.removeItem(LS_KEY);
  DATA = JSON.parse(JSON.stringify(window.CB_DATA));
  CUR = 0; renderList(); renderEditor(); toast('已恢复初始数据');
}
function dl(name, text) {
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}
function cbExport(kind) {
  const json = JSON.stringify(DATA, null, 2);
  if (kind === 'js') dl('data.js', 'window.CB_DATA = ' + json + ';\n');
  else dl('data.json', json);
  toast('已导出，替换网站目录中的同名文件即可生效');
}
function cbImport() {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
  inp.onchange = () => {
    const f = inp.files[0]; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      try { const j = JSON.parse(fr.result); if (!j.projects) throw new Error('缺少 projects 字段'); DATA = j; CUR = 0; renderList(); renderEditor(); toast('导入成功'); }
      catch (e) { toast('导入失败：' + e.message); }
    };
    fr.readAsText(f);
  };
  inp.click();
}
function cbPreview() { window.open('index.html', '_blank'); }
function cbAddProject() {
  DATA.projects.push({
    id: 'p' + Date.now(), seq: DATA.projects.length + 1, short: '新项目', tag: '', name: '请填写项目名称',
    investor: '', company: '', contact: '', phone: '', pos: { x: 40, y: 40 }, images: [], nodes: []
  });
  CUR = DATA.projects.length - 1; renderList(); renderEditor();
}
function cbMove(dir) {
  const i = CUR, j = i + dir;
  if (j < 0 || j >= DATA.projects.length) return;
  const a = DATA.projects; [a[i], a[j]] = [a[j], a[i]];
  a.forEach((p, k) => p.seq = k + 1);
  CUR = j; renderList(); renderEditor();
}
function cbDelProject() {
  if (!DATA.projects.length) return;
  if (!confirm('确定删除项目「' + (DATA.projects[CUR].short || '') + '」？')) return;
  DATA.projects.splice(CUR, 1);
  DATA.projects.forEach((p, k) => p.seq = k + 1);
  CUR = Math.max(0, CUR - 1); renderList(); renderEditor();
}

/* ---------------- 发布到 GitHub / Gitee ---------------- */
function cbPublishPanel() {
  const cfg = JSON.parse(localStorage.getItem(LS_CFG) || '{}');
  const ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(2,8,18,.82);z-index:150;display:flex;align-items:center;justify-content:center;';
  ov.innerHTML =
    '<div class="panel" style="width:560px;">' +
    '<h3>发布到大屏（更新仓库中的 data.json）</h3><div class="bd">' +
    '<div class="row r2"><div><label>平台</label><select id="pb_platform"><option value="github">GitHub</option><option value="gitee">Gitee（码云）</option></select></div>' +
    '<div><label>分支</label><input id="pb_branch" value="' + esc(cfg.branch || 'main') + '"></div></div>' +
    '<div class="row r2"><div><label>用户名 / 组织</label><input id="pb_owner" value="' + esc(cfg.owner || '') + '" placeholder="如 zhangsan"></div>' +
    '<div><label>仓库名</label><input id="pb_repo" value="' + esc(cfg.repo || '') + '" placeholder="如 duji-dashboard"></div></div>' +
    '<div class="row"><div><label>文件路径</label><input id="pb_path" value="' + esc(cfg.path || 'data.json') + '"></div></div>' +
    '<div class="row"><div><label>访问令牌 Token（需勾选仓库读写权限）</label><input id="pb_token" type="password" value="' + esc(cfg.token || '') + '"></div></div>' +
    '<p class="tip">说明：令牌只保存在本机浏览器中，不会上传到别处。发布成功后，大屏刷新即可看到最新数据。首次配置可参考《使用说明.md》。</p>' +
    '<div class="flex" style="margin-top:14px;"><button class="primary" id="pb_go">开始发布</button><button id="pb_cancel">取消</button><span id="pb_msg" class="tip"></span></div>' +
    '</div></div>';
  document.body.appendChild(ov);
  $('#pb_cancel').onclick = () => ov.remove();
  $('#pb_platform').value = cfg.platform || 'github';
  $('#pb_go').onclick = async () => {
    const c = {
      platform: $('#pb_platform').value, owner: $('#pb_owner').value.trim(), repo: $('#pb_repo').value.trim(),
      path: $('#pb_path').value.trim(), branch: $('#pb_branch').value.trim() || 'main', token: $('#pb_token').value.trim()
    };
    if (!c.owner || !c.repo || !c.token) { $('#pb_msg').textContent = '请填写用户名、仓库名和令牌'; return; }
    localStorage.setItem(LS_CFG, JSON.stringify(c));
    $('#pb_msg').textContent = '发布中…';
    try {
      const r = await pushFile(c, JSON.stringify(DATA, null, 2));
      $('#pb_msg').textContent = '✅ 发布成功，大屏刷新即可看到新数据';
      toast('发布成功：' + r);
    } catch (e) { $('#pb_msg').textContent = '❌ ' + e.message; }
  };
}

async function pushFile(c, content) {
  const isG = c.platform === 'gitee';
  const base = isG ? 'https://gitee.com/api/v5' : 'https://api.github.com';
  const qs = isG ? '?access_token=' + encodeURIComponent(c.token) + '&ref=' + encodeURIComponent(c.branch)
    : '?ref=' + encodeURIComponent(c.branch);
  const url = base + '/repos/' + c.owner + '/' + c.repo + '/contents/' + encodeURIComponent(c.path).replace(/%2F/g, '/') + qs;
  const headers = isG ? { 'Content-Type': 'application/json' } : {
    'Authorization': 'Bearer ' + c.token, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json'
  };
  let sha = null;
  const g = await fetch(url, { headers });
  if (g.ok) { const j = await g.json(); sha = j.sha; }
  else if (g.status !== 404) { throw new Error('读取远端文件失败（' + g.status + '），请检查仓库、分支与令牌权限'); }
  const body = {
    message: '更新平台数据 ' + new Date().toLocaleString('zh-CN'),
    content: b64utf8(content), branch: c.branch, sha: sha || undefined
  };
  if (isG) body.access_token = c.token;
  const r = await fetch(base + '/repos/' + c.owner + '/' + c.repo + '/contents/' + encodeURIComponent(c.path).replace(/%2F/g, '/'), {
    method: 'PUT', headers, body: JSON.stringify(body)
  });
  if (!r.ok) { const t = await r.text(); throw new Error('写入失败（' + r.status + '）：' + t.slice(0, 160)); }
  return c.path;
}
function b64utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = ''; bytes.forEach((b) => bin += String.fromCharCode(b));
  return btoa(bin);
}
