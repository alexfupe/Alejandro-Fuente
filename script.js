// Año del pie de página
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Línea de tiempo (datos de mi CV) ----
// Las fechas son años decimales: 2024.25 = abril de 2024.
const AXIS_START = 2022;
const AXIS_END = 2027;

const rows = [
  {
    label: 'Formación',
    bars: [
      { text: 'G.M. SMR', from: 2022.0, to: 2024.0, cls: '' },
      { text: 'G.S. DAM', from: 2024.0, to: 2026.0, cls: 'edu2' },
      { text: 'G.S. DAW', from: 2026.0, to: 2027.0, cls: 'edu3 now' },
    ],
  },
  {
    label: 'Prácticas',
    bars: [
      { text: 'HM Hospitales', from: 2024.25, to: 2024.5, cls: 'job hm', outside: true },
      { text: 'Orbit · Sage 200', from: 2026.17, to: 2026.5, cls: 'job hm', outside: true },
    ],
  },
];

const pct = (year) => ((year - AXIS_START) / (AXIS_END - AXIS_START)) * 100;

function buildGantt() {
  const gantt = document.getElementById('gantt');
  const axis = document.createElement('div');
  axis.className = 'g-axis';
  for (let y = AXIS_START; y < AXIS_END; y++) {
    const tick = document.createElement('div');
    tick.className = 'g-tick';
    tick.style.left = pct(y) + '%';
    tick.innerHTML = `<span>${y}</span>`;
    axis.appendChild(tick);
  }
  gantt.appendChild(axis);

  rows.forEach((row) => {
    const r = document.createElement('div');
    r.className = 'g-row';
    r.innerHTML = `<b>${row.label}</b>`;
    row.bars.forEach((b) => {
      const el = document.createElement('div');
      el.className = 'g-bar ' + b.cls;
      el.style.left = pct(b.from) + '%';
      el.style.width = (pct(b.to) - pct(b.from)) + '%';
      el.title = b.text;
      el.innerHTML = b.outside ? `<span class="out">${b.text}</span>` : b.text;
      r.appendChild(el);
    });
    gantt.appendChild(r);
  });
}
buildGantt();

// ---- Repositorios de GitHub ----
const GITHUB_USER = 'alexfupe';
const reposEl = document.getElementById('repos');

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function loadRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`);
    if (!res.ok) throw new Error(res.status);
    const repos = (await res.json())
      .filter((r) => !r.fork && r.name.toLowerCase() !== `${GITHUB_USER}.github.io`)
      .slice(0, 6);

    if (!repos.length) {
      reposEl.innerHTML = '<p class="empty">Todavía no hay repositorios públicos. Pronto subiré proyectos nuevos.</p>';
      return;
    }
    reposEl.innerHTML = repos.map((r) => `
      <a class="repo" href="${escapeHtml(r.html_url)}" target="_blank" rel="noopener">
        <h3>${escapeHtml(r.name)}</h3>
        <p>${escapeHtml(r.description) || 'Sin descripción.'}</p>
        <small>${escapeHtml(r.language) || 'Varios lenguajes'}</small>
      </a>`).join('');
  } catch (err) {
    reposEl.innerHTML = `<p class="empty">No se han podido cargar los repositorios. Míralos directamente en <a href="https://github.com/${GITHUB_USER}">github.com/${GITHUB_USER}</a>.</p>`;
  }
}
loadRepos();
