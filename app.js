const app = document.querySelector('#app');
const toastRegion = document.querySelector('#toast-region');

const roleMeta = {
  ciudadano: { label: 'Ciudadano', name: 'Celia Casas', email: 'celia@ecogo.pe', initials: 'CC' },
  recolector: { label: 'Recolector', name: 'Juan Pérez', email: 'juan@ecogo.pe', initials: 'JP' },
  admin: { label: 'Administrador', name: 'María López', email: 'maria@ecogo.pe', initials: 'ML' }
};

const state = {
  authenticated: false,
  role: 'ciudadano',
  view: 'dashboard',
  selectedRequest: 'ECO-1048',
  requestSearch: '',
  requestStatus: 'todos',
  requests: [
    { code: 'ECO-1048', material: 'Cartón', kg: 12, address: 'Av. Las Flores 430, Miraflores', date: '25 nov 2026', isoDate: '2026-11-25', status: 'pendiente', collector: '', observations: 'Cajas plegadas junto a la puerta principal.', createdBy: 'Celia Casas', createdAt: 'Hoy, 09:24' },
    { code: 'ECO-1047', material: 'Plástico', kg: 8, address: 'Jr. Los Olivos 182, San Isidro', date: '24 nov 2026', isoDate: '2026-11-24', status: 'asignada', collector: 'Juan Pérez', observations: 'Bolsas transparentes, separadas por tipo.', createdBy: 'Celia Casas', createdAt: 'Ayer, 16:10' },
    { code: 'ECO-1046', material: 'Papel', kg: 15, address: 'Calle Grau 690, Barranco', date: '23 nov 2026', isoDate: '2026-11-23', status: 'en-camino', collector: 'Juan Pérez', observations: 'Material seco. Tocar el timbre azul.', createdBy: 'Roberto Díaz', createdAt: '23 nov, 08:40' },
    { code: 'ECO-1045', material: 'Vidrio', kg: 22, address: 'Av. El Sol 215, Surco', date: '22 nov 2026', isoDate: '2026-11-22', status: 'completada', collector: 'Ana Torres', observations: 'Frascos y botellas sin tapas.', createdBy: 'Celia Casas', createdAt: '22 nov, 11:05', collectedKg: 20 },
    { code: 'ECO-1044', material: 'Cartón', kg: 7, address: 'Calle Lima 102, Pueblo Libre', date: '21 nov 2026', isoDate: '2026-11-21', status: 'completada', collector: 'Juan Pérez', observations: '', createdBy: 'Diego Ramos', createdAt: '21 nov, 09:12', collectedKg: 7 },
  ],
  collectors: [
    { name: 'Juan Pérez', zone: 'Miraflores · San Isidro', status: 'Disponible', initials: 'JP', phone: '+51 987 221 432' },
    { name: 'Ana Torres', zone: 'Surco · Barranco', status: 'En ruta', initials: 'AT', phone: '+51 986 332 190' },
    { name: 'Luis Mendoza', zone: 'San Borja · La Molina', status: 'Disponible', initials: 'LM', phone: '+51 985 441 009' },
  ],
  users: [
    { name: 'Celia Casas', email: 'celia@ecogo.pe', role: 'Ciudadano', joined: '12 nov 2026', active: true },
    { name: 'Juan Pérez', email: 'juan@ecogo.pe', role: 'Recolector', joined: '08 nov 2026', active: true },
    { name: 'Ana Torres', email: 'ana@ecogo.pe', role: 'Recolector', joined: '02 nov 2026', active: true },
    { name: 'Roberto Díaz', email: 'roberto@ecogo.pe', role: 'Ciudadano', joined: '31 oct 2026', active: true },
  ]
};

const navByRole = {
  ciudadano: [
    ['dashboard', '⌂', 'Resumen'],
    ['new-request', '＋', 'Nueva solicitud'],
    ['requests', '↗', 'Mis solicitudes'],
  ],
  recolector: [
    ['dashboard', '⌂', 'Resumen'],
    ['collection', '♻', 'Mis recojos'],
    ['requests', '↗', 'Solicitudes'],
  ],
  admin: [
    ['dashboard', '⌂', 'Resumen'],
    ['requests', '↗', 'Solicitudes'],
    ['assignment', '◎', 'Asignaciones'],
    ['reports', '▥', 'Reportes'],
    ['users', '♙', 'Usuarios'],
  ]
};

const viewTitles = {
  dashboard: ['Resumen', 'Una mirada rápida a la operación de hoy.'],
  'new-request': ['Nueva solicitud', 'Programa un recojo en pocos pasos.'],
  requests: ['Solicitudes', 'Consulta y sigue cada servicio de recolección.'],
  collection: ['Mis recojos', 'Actualiza el avance de los servicios asignados.'],
  assignment: ['Asignaciones', 'Coordina solicitudes pendientes con tu equipo.'],
  reports: ['Reportes', 'Convierte la actividad de EcoGo en decisiones.'],
  users: ['Usuarios', 'Administra los perfiles que usan la plataforma.']
};

function statusLabel(status) {
  return ({ pendiente: 'Pendiente', asignada: 'Asignada', 'en-camino': 'En camino', completada: 'Completada', cancelada: 'Cancelada' })[status] || status;
}

function materialIcon(material) {
  return ({ Cartón: '▧', Plástico: '◈', Papel: '▤', Vidrio: '◉' })[material] || '♻';
}

function initials(name) {
  return name.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase();
}

function showToast(title, message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">✓</span><div><strong>${title}</strong>${message}</div>`;
  toastRegion.appendChild(toast);
  setTimeout(() => toast.remove(), 3800);
}

function formatNumber(number) {
  return new Intl.NumberFormat('es-PE').format(number);
}

function currentUser() { return roleMeta[state.role]; }

function go(view) {
  state.view = view;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loginScreen() {
  return `<main class="login-screen">
    <section class="login-art">
      <div class="brand"><span class="brand-mark">↻</span> ecogo</div>
      <div class="login-copy">
        <div class="eyebrow">Recolección que conecta</div>
        <h1>Haz que cada material vuelva a tener valor.</h1>
        <p>Coordina, recoge y mide el impacto de tus reciclables desde un solo lugar. EcoGo acerca a ciudadanos, recolectores y comunidades.</p>
        <div class="login-orbit">
          <div class="orbit-ring"></div>
          <div class="orbit-stats">
            <div class="orbit-stat"><strong>1.8 t</strong><span>recuperadas este mes</span></div>
            <div class="orbit-stat"><strong>94%</strong><span>servicios a tiempo</span></div>
          </div>
        </div>
      </div>
      <div class="eyebrow">EcoGo · piloto comunitario · 2026</div>
    </section>
    <section class="login-panel">
      <div class="login-card">
        <div class="eyebrow">Portal EcoGo</div>
        <h2>Inicia sesión</h2>
        <p>Usa una cuenta demo para explorar cada experiencia del prototipo.</p>
        <form class="form-stack" id="login-form">
          <div class="field"><label for="login-email">Correo electrónico</label><input id="login-email" type="email" value="${roleMeta[state.role].email}" required /></div>
          <div class="field"><label for="login-password">Contraseña</label><div class="password-wrap"><input id="login-password" type="password" value="ecogo2026" required /><button type="button" class="password-toggle" aria-label="Mostrar contraseña">◉</button></div></div>
          <button class="primary-btn full" type="submit">Ingresar al portal <span>→</span></button>
        </form>
        <div class="login-help">Explorar como:</div>
        <div class="demo-roles">
          ${Object.entries(roleMeta).map(([role, meta]) => `<button type="button" class="role-chip ${state.role === role ? 'active' : ''}" data-demo-role="${role}">${meta.label}</button>`).join('')}
        </div>
        <p class="login-help">Prototipo interactivo · los cambios se guardan solo durante esta sesión.</p>
      </div>
    </section>
  </main>`;
}

function shell() {
  const meta = currentUser();
  const [title, description] = viewTitles[state.view] || viewTitles.dashboard;
  const nav = navByRole[state.role];
  return `<div class="app-shell">
    <aside class="sidebar" id="sidebar">
      <div class="brand"><span class="brand-mark">↻</span> ecogo</div>
      <div class="sidebar-label">Workspace</div>
      <nav class="nav-list" aria-label="Navegación principal">
        ${nav.map(([view, icon, label]) => `<button class="nav-item ${state.view === view ? 'active' : ''}" data-nav="${view}"><span class="nav-icon">${icon}</span>${label}</button>`).join('')}
      </nav>
      ${state.role === 'admin' ? `<div class="sidebar-label">Gestión</div><nav class="nav-list"><button class="nav-item ${state.view === 'reports' ? 'active' : ''}" data-nav="reports"><span class="nav-icon">▥</span>Reportes</button><button class="nav-item ${state.view === 'users' ? 'active' : ''}" data-nav="users"><span class="nav-icon">♙</span>Usuarios</button></nav>` : ''}
      <div class="sidebar-bottom">
        <div class="sidebar-user"><div class="avatar">${meta.initials}</div><div><strong>${meta.name}</strong><span>${meta.label}</span></div></div>
        <button class="logout-btn" data-logout>Cerrar sesión</button>
      </div>
    </aside>
    <main class="main-content">
      <header class="topbar">
        <div style="display:flex; align-items:center; gap:10px"><button class="mobile-menu" data-mobile-menu aria-label="Abrir menú">☰</button><div class="breadcrumb">EcoGo <span>/</span> <strong>${title}</strong></div></div>
        <div class="top-actions">
          <div class="demo-switcher"><label for="role-switcher">Vista demo</label><select id="role-switcher"><option value="ciudadano" ${state.role === 'ciudadano' ? 'selected' : ''}>Ciudadano</option><option value="recolector" ${state.role === 'recolector' ? 'selected' : ''}>Recolector</option><option value="admin" ${state.role === 'admin' ? 'selected' : ''}>Administrador</option></select></div>
          <button class="icon-btn" aria-label="Notificaciones">♢<span class="dot"></span></button>
          <div class="avatar" title="${meta.name}">${meta.initials}</div>
        </div>
      </header>
      <div class="page-heading"><div><div class="eyebrow">${roleContext()}</div><h1>${title}</h1><p>${description}</p></div>${headingActions()}</div>
      ${renderView()}
    </main>
  </div>`;
}

function roleContext() {
  if (state.role === 'admin') return 'Control central · visión operativa';
  if (state.role === 'recolector') return 'Ruta activa · servicios asignados';
  return 'Tu impacto empieza aquí';
}

function headingActions() {
  if (state.view === 'dashboard' && state.role === 'ciudadano') return `<div class="heading-actions"><button class="primary-btn" data-nav="new-request">＋ Nueva solicitud</button></div>`;
  if (state.view === 'requests' && state.role === 'ciudadano') return `<div class="heading-actions"><button class="primary-btn" data-nav="new-request">＋ Nueva solicitud</button></div>`;
  if (state.view === 'assignment') return `<div class="heading-actions"><button class="secondary-btn" data-action="refresh">↻ Actualizar lista</button></div>`;
  return '';
}

function renderView() {
  if (state.view === 'new-request') return newRequestView();
  if (state.view === 'requests') return requestsView();
  if (state.view === 'collection') return collectionView();
  if (state.view === 'assignment') return assignmentView();
  if (state.view === 'reports') return reportsView();
  if (state.view === 'users') return usersView();
  return dashboardView();
}

function dashboardView() {
  const stats = state.role === 'admin' ? [['Solicitudes activas', '18', '+12% vs. semana pasada', '↗'], ['Recolectado este mes', '1,8 t', '+18% vs. mes anterior', '♻'], ['Recolectores activos', '12', '3 en ruta ahora', '◎'], ['Tasa de cumplimiento', '94%', '+4 pts vs. mes anterior', '✓']] : state.role === 'recolector' ? [['Servicios asignados', '8', '3 para hoy', '◎'], ['Kg recolectados', '146 kg', '+22 kg esta semana', '♻'], ['En camino', '2', 'Próximo: 10:30 a. m.', '↗'], ['Servicios completados', '31', '+8% este mes', '✓']] : [['Mis solicitudes', '5', '2 requieren seguimiento', '↗'], ['Kg recuperados', '49 kg', '+12 kg este mes', '♻'], ['Próximo recojo', '25 nov', 'Cartón · 12 kg', '◎'], ['Impacto estimado', '3,2 kg', 'de CO₂ evitados', '✦']];
  return `<div class="content-grid">
    ${state.role === 'ciudadano' ? `<section class="card hero-card"><div class="eyebrow">Hola, ${currentUser().name.split(' ')[0]} · martes 22 de noviembre</div><h2>Tu reciclaje mueve la ciudad.</h2><p>Ya tienes una solicitud próxima. Revisa su estado o programa un nuevo recojo para seguir sumando.</p><button class="primary-btn" data-nav="new-request">Solicitar un recojo <span>→</span></button></section>` : state.role === 'recolector' ? `<section class="card hero-card"><div class="eyebrow">Buenos días, ${currentUser().name.split(' ')[0]} · ruta del día</div><h2>Tres paradas te esperan hoy.</h2><p>Tu siguiente servicio es en Miraflores. Revisa la dirección y actualiza el estado al iniciar el recorrido.</p><button class="primary-btn" data-nav="collection">Ver mis recojos <span>→</span></button></section>` : `<section class="card hero-card"><div class="eyebrow">Operación EcoGo · martes 22 de noviembre</div><h2>La ciudad está reciclando mejor.</h2><p>Hay 6 solicitudes pendientes de asignación y 12 recolectores activos. Mantén el flujo en movimiento.</p><button class="primary-btn" data-nav="assignment">Gestionar asignaciones <span>→</span></button></section>`}
    <section class="content-grid grid-4">${stats.map(([label, value, trend, icon]) => `<div class="card stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-trend">${trend}</div><span class="stat-icon">${icon}</span></div>`).join('')}</section>
    <section class="content-grid grid-2">
      <div class="card"><div class="card-header"><div><div class="card-title">Actividad reciente</div><div class="card-subtitle">Lo último que pasó en tu espacio.</div></div><button class="text-link" data-nav="requests">Ver todo →</button></div>${recentActivity()}</div>
      <div class="card"><div class="card-header"><div><div class="card-title">Progreso del mes</div><div class="card-subtitle">Meta comunitaria de materiales recuperados.</div></div><span class="status status-completada">En curso</span></div><div style="display:flex;align-items:end;gap:10px;margin:18px 0 11px"><strong style="font-size:32px;letter-spacing:-.07em">1,8 t</strong><span style="color:var(--muted);font-size:12px;padding-bottom:5px">de 2,4 t meta</span></div><div class="progress-track"><div class="progress-fill" style="width:75%"></div></div><div style="display:flex;justify-content:space-between;color:var(--muted);font-size:11px;margin-top:9px"><span>75% completado</span><strong style="color:var(--forest-700)">+18% este mes</strong></div><div class="content-grid grid-2" style="margin-top:23px"><div class="mini-kpi"><div class="mini-kpi-icon">▧</div><div><strong>42%</strong><span>Cartón</span></div></div><div class="mini-kpi"><div class="mini-kpi-icon">◈</div><div><strong>28%</strong><span>Plástico</span></div></div></div></div>
    </section>
  </div>`;
}

function recentActivity() {
  const visible = state.role === 'recolector' ? state.requests.filter(r => r.collector === 'Juan Pérez').slice(0, 4) : state.role === 'admin' ? state.requests.slice(0, 4) : state.requests.filter(r => r.createdBy === 'Celia Casas').slice(0, 4);
  return `<div class="list">${visible.map(request => `<div class="list-row"><div class="list-main"><div class="list-bullet"></div><div><strong>${request.code} · ${request.material}</strong><span>${request.address}</span></div></div><div class="list-meta"><span class="status status-${request.status}">${statusLabel(request.status)}</span></div></div>`).join('')}</div>`;
}

function newRequestView() {
  return `<div class="content-grid grid-2"><section class="card"><div class="card-header"><div><div class="card-title">Detalles del material</div><div class="card-subtitle">Cuéntanos qué vamos a recoger.</div></div><span class="status status-pendiente">Paso 1 de 1</span></div><form class="form-grid" id="request-form"><div class="field"><label for="material">Tipo de material *</label><select id="material" required><option value="">Selecciona un material</option><option>Cartón</option><option>Plástico</option><option>Papel</option><option>Vidrio</option></select></div><div class="field"><label for="quantity">Cantidad aproximada (kg) *</label><input id="quantity" type="number" min="1" step="0.5" placeholder="Ej. 10" required /></div><div class="field span-2"><label for="address">Dirección de recojo *</label><input id="address" type="text" placeholder="Calle, número y distrito" required /></div><div class="field"><label for="date">Fecha preferida *</label><input id="date" type="date" min="2026-11-22" required /></div><div class="field"><label for="time">Rango horario</label><select id="time"><option>9:00 a. m. — 12:00 p. m.</option><option>12:00 p. m. — 3:00 p. m.</option><option>3:00 p. m. — 6:00 p. m.</option></select></div><div class="field span-2"><label for="observations">Observaciones <span style="color:var(--muted);font-weight:500">(opcional)</span></label><textarea id="observations" placeholder="Ej. El material está en la cochera, junto al portón..."></textarea></div><div class="form-actions span-2"><button type="button" class="ghost-btn" data-nav="dashboard">Cancelar</button><button type="submit" class="primary-btn">Enviar solicitud →</button></div></form></section><aside class="content-grid"><div class="card"><div class="card-header"><div><div class="card-title">¿Cómo funciona?</div><div class="card-subtitle">Tu solicitud pasa por 4 estados simples.</div></div></div><div class="timeline" style="grid-template-columns:1fr"><div class="timeline-step done" style="display:flex;text-align:left;gap:12px;align-items:center"><div class="timeline-dot" style="margin:0">1</div><div><div class="timeline-label">Pendiente</div><div style="font-size:11px;color:var(--muted);margin-top:3px">Recibimos tu pedido.</div></div></div><div class="timeline-step" style="display:flex;text-align:left;gap:12px;align-items:center;margin-top:12px"><div class="timeline-dot" style="margin:0">2</div><div><div class="timeline-label">Asignada</div><div style="font-size:11px;color:var(--muted);margin-top:3px">Un recolector acepta el servicio.</div></div></div><div class="timeline-step" style="display:flex;text-align:left;gap:12px;align-items:center;margin-top:12px"><div class="timeline-dot" style="margin:0">3</div><div><div class="timeline-label">En camino</div><div style="font-size:11px;color:var(--muted);margin-top:3px">El recolector inicia su ruta.</div></div></div><div class="timeline-step" style="display:flex;text-align:left;gap:12px;align-items:center;margin-top:12px"><div class="timeline-dot" style="margin:0">4</div><div><div class="timeline-label">Completada</div><div style="font-size:11px;color:var(--muted);margin-top:3px">El material ya fue recuperado.</div></div></div></div></div><div class="card" style="background:#eff8e9;border-color:#d8ebc7"><div class="eyebrow">Tip EcoGo</div><div style="font-family:Georgia,serif;font-size:20px;line-height:1.1;margin:9px 0;color:var(--forest-800)">Separa, limpia y compacta tus materiales.</div><div style="color:var(--forest-700);font-size:12px;line-height:1.5">Así el recolector puede trabajar más rápido y aprovechamos mejor cada kilo.</div></div></aside></div>`;
}

function filteredRequests() {
  return state.requests.filter(request => {
    const q = state.requestSearch.trim().toLowerCase();
    const matchesSearch = !q || [request.code, request.material, request.address, request.collector].join(' ').toLowerCase().includes(q);
    const matchesStatus = state.requestStatus === 'todos' || request.status === state.requestStatus;
    const matchesRole = state.role === 'ciudadano' ? request.createdBy === 'Celia Casas' : state.role === 'recolector' ? request.collector === 'Juan Pérez' : true;
    return matchesSearch && matchesStatus && matchesRole;
  });
}

function requestsView() {
  const requests = filteredRequests();
  return `<section class="card"><div class="search-toolbar"><div class="search-group"><input class="search-input" id="request-search" value="${state.requestSearch}" placeholder="Buscar por código, material o dirección..." aria-label="Buscar solicitudes" /><select class="filter-select" id="request-status"><option value="todos" ${state.requestStatus === 'todos' ? 'selected' : ''}>Todos los estados</option><option value="pendiente" ${state.requestStatus === 'pendiente' ? 'selected' : ''}>Pendiente</option><option value="asignada" ${state.requestStatus === 'asignada' ? 'selected' : ''}>Asignada</option><option value="en-camino" ${state.requestStatus === 'en-camino' ? 'selected' : ''}>En camino</option><option value="completada" ${state.requestStatus === 'completada' ? 'selected' : ''}>Completada</option></select></div><span style="color:var(--muted);font-size:11px">${requests.length} solicitudes</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Solicitud</th><th>Material</th><th>Recojo</th><th>Estado</th><th></th></tr></thead><tbody>${requests.length ? requests.map(requestRow).join('') : `<tr><td colspan="5"><div class="empty"><div class="empty-icon">⌕</div>No encontramos solicitudes con esos filtros.</div></td></tr>`}</tbody></table></div></section>${state.selectedRequest ? requestDetail(state.selectedRequest) : ''}`;
}

function requestRow(request) {
  return `<tr><td><span class="code">${request.code}</span><span class="table-secondary">${request.createdAt}</span></td><td><strong>${materialIcon(request.material)} ${request.material}</strong><span class="table-secondary">${request.kg} kg aprox.</span></td><td><strong>${request.date}</strong><span class="table-secondary">${request.address}</span></td><td><span class="status status-${request.status}">${statusLabel(request.status)}</span></td><td><button class="table-action" data-request="${request.code}">Ver detalle →</button></td></tr>`;
}

function requestDetail(code) {
  const request = state.requests.find(item => item.code === code);
  if (!request) return '';
  const stages = ['pendiente', 'asignada', 'en-camino', 'completada'];
  const currentIndex = stages.indexOf(request.status);
  return `<section class="card section-space"><div class="card-header"><div><div class="card-title">Detalle de ${request.code}</div><div class="card-subtitle">Última actualización: ${request.status === 'completada' ? '22 nov, 15:42' : 'Hoy, 09:24'}</div></div><span class="status status-${request.status}">${statusLabel(request.status)}</span></div><div class="timeline">${stages.map((stage, index) => `<div class="timeline-step ${index < currentIndex ? 'done' : ''} ${index === currentIndex ? 'current' : ''}"><div class="timeline-dot">${index < currentIndex ? '✓' : index + 1}</div><div class="timeline-label">${statusLabel(stage)}</div></div>`).join('')}</div><div class="detail-grid" style="margin-top:28px"><div class="detail-list"><div class="detail-item"><span>Material</span><strong>${materialIcon(request.material)} ${request.material} · ${request.kg} kg aprox.</strong></div><div class="detail-item"><span>Dirección</span><strong>${request.address}</strong></div><div class="detail-item"><span>Fecha programada</span><strong>${request.date}</strong></div><div class="detail-item"><span>Recolector</span><strong>${request.collector || 'Por asignar'}</strong></div></div><div style="background:var(--surface-soft);border-radius:15px;padding:16px"><div class="eyebrow">Nota del servicio</div><div style="font-size:12px;line-height:1.55;margin-top:8px;color:var(--ink)">${request.observations || 'Sin observaciones registradas.'}</div>${request.collectedKg ? `<div style="margin-top:15px;color:var(--forest-700);font-size:12px;font-weight:800">✓ ${request.collectedKg} kg registrados al completar</div>` : ''}</div></div></section>`;
}

function collectionView() {
  const assigned = state.requests.filter(request => request.collector === 'Juan Pérez');
  return `<div class="content-grid grid-3"><div class="card stat-card"><div class="stat-label">Servicios de hoy</div><div class="stat-value">3</div><div class="stat-trend">2 pendientes · 1 completado</div><span class="stat-icon">◎</span></div><div class="card stat-card"><div class="stat-label">Kg recuperados</div><div class="stat-value">38 kg</div><div class="stat-trend">+12% vs. tu promedio</div><span class="stat-icon">♻</span></div><div class="card stat-card"><div class="stat-label">Tu cumplimiento</div><div class="stat-value">96%</div><div class="stat-trend">Excelente trabajo</div><span class="stat-icon">✓</span></div></div><section class="card section-space"><div class="card-header"><div><div class="card-title">Servicios asignados</div><div class="card-subtitle">Actualiza el estado al avanzar en tu ruta.</div></div><span class="status status-en-camino">Ruta activa</span></div><div class="list">${assigned.map(request => `<div class="assignment-card"><div><h4><span class="code">${request.code}</span> · ${materialIcon(request.material)} ${request.material} · ${request.kg} kg</h4><p>${request.address}<br />Programado para ${request.date}</p><div style="margin-top:8px"><span class="status status-${request.status}">${statusLabel(request.status)}</span></div></div><div class="assignment-controls">${request.status !== 'completada' ? `<select data-collector-status="${request.code}"><option value="${request.status}">${statusLabel(request.status)}</option>${request.status === 'asignada' ? '<option value="en-camino">En camino</option>' : ''}${request.status === 'en-camino' ? '<option value="completada">Completada</option>' : ''}</select><button class="secondary-btn" data-update-collection="${request.code}">Guardar</button>` : `<span style="color:var(--forest-700);font-size:11px;font-weight:850">✓ Cerrado</span>`}</div></div>`).join('')}</div></section>`;
}

function assignmentView() {
  const pending = state.requests.filter(request => request.status === 'pendiente');
  return `<div class="admin-banner"><span style="font-size:22px">✦</span><div><strong>${pending.length} solicitudes necesitan asignación</strong><div>Asigna un recolector activo y una fecha para mantener la operación en movimiento.</div></div></div><section class="card"><div class="card-header"><div><div class="card-title">Cola de asignación</div><div class="card-subtitle">Solo se muestran solicitudes pendientes.</div></div><span class="status status-pendiente">${pending.length} pendientes</span></div>${pending.length ? pending.map(request => `<div class="assignment-card"><div><h4><span class="code">${request.code}</span> · ${materialIcon(request.material)} ${request.material} · ${request.kg} kg</h4><p>${request.address}<br />Preferencia: ${request.date}</p></div><div class="assignment-controls"><select data-assign-collector="${request.code}"><option value="">Recolector...</option>${state.collectors.filter(c => c.status !== 'Fuera de servicio').map(collector => `<option value="${collector.name}">${collector.name}</option>`).join('')}</select><input type="date" value="${request.isoDate}" data-assign-date="${request.code}" /><button class="primary-btn" data-assign="${request.code}">Asignar</button></div></div>`).join('') : `<div class="empty"><div class="empty-icon">✓</div>Todo está asignado. Buen trabajo, equipo.</div>`}</section><section class="card section-space"><div class="card-header"><div><div class="card-title">Equipo activo</div><div class="card-subtitle">Disponibilidad actual de recolectores.</div></div><button class="text-link" data-nav="users">Gestionar equipo →</button></div><div class="content-grid grid-3">${state.collectors.map(collector => `<div style="border:1px solid var(--line);border-radius:14px;padding:14px"><div style="display:flex;align-items:center;gap:9px"><div class="avatar">${collector.initials}</div><div><strong style="font-size:12px">${collector.name}</strong><div style="color:var(--muted);font-size:10px;margin-top:3px">${collector.zone}</div></div></div><div style="margin-top:14px"><span class="status ${collector.status === 'Disponible' ? 'status-completada' : 'status-en-camino'}">${collector.status}</span></div></div>`).join('')}</div></section>`;
}

function reportsView() {
  const totals = { Cartón: 680, Plástico: 445, Papel: 310, Vidrio: 365 };
  const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
  const max = Math.max(...Object.values(totals));
  return `<div class="content-grid grid-4"><div class="card stat-card"><div class="stat-label">Total recuperado</div><div class="stat-value">${(total / 1000).toFixed(1).replace('.', ',')} t</div><div class="stat-trend">+18% vs. mes anterior</div><span class="stat-icon">♻</span></div><div class="card stat-card"><div class="stat-label">Servicios completados</div><div class="stat-value">86</div><div class="stat-trend">+11 esta semana</div><span class="stat-icon">✓</span></div><div class="card stat-card"><div class="stat-label">Promedio por servicio</div><div class="stat-value">20,9 kg</div><div class="stat-trend">+2,4 kg vs. octubre</div><span class="stat-icon">↗</span></div><div class="card stat-card"><div class="stat-label">Distritos activos</div><div class="stat-value">7</div><div class="stat-trend">2 nuevos este mes</div><span class="stat-icon">⌖</span></div></div><section class="content-grid grid-2 section-space"><div class="card"><div class="card-header"><div><div class="card-title">Materiales recuperados</div><div class="card-subtitle">Kilogramos por categoría · noviembre 2026.</div></div><span class="status status-completada">Actualizado hoy</span></div><div class="chart-bars">${Object.entries(totals).map(([material, value]) => `<div class="bar-col"><div class="bar-value">${value} kg</div><div class="bar" style="height:${Math.round((value / max) * 135)}px"></div><div class="bar-label">${material}</div></div>`).join('')}</div><div class="legend"><div class="legend-item"><span class="legend-dot"></span>Kg recolectados</div><div class="legend-item"><span class="legend-dot alt"></span>Meta mensual: 2,4 t</div></div></div><div class="card"><div class="card-header"><div><div class="card-title">Cumplimiento por estado</div><div class="card-subtitle">Cómo avanza cada solicitud.</div></div></div><div class="list"><div class="list-row"><div class="list-main"><div class="list-bullet" style="background:var(--warning)"></div><div><strong>Pendientes</strong><span>Por asignar</span></div></div><div class="list-meta"><strong>6</strong><span>7%</span></div></div><div class="list-row"><div class="list-main"><div class="list-bullet" style="background:var(--info)"></div><div><strong>Asignadas</strong><span>Con recolector</span></div></div><div class="list-meta"><strong>4</strong><span>5%</span></div></div><div class="list-row"><div class="list-main"><div class="list-bullet" style="background:#9273bd"></div><div><strong>En camino</strong><span>En ruta activa</span></div></div><div class="list-meta"><strong>7</strong><span>8%</span></div></div><div class="list-row"><div class="list-main"><div class="list-bullet" style="background:var(--forest-700)"></div><div><strong>Completadas</strong><span>Servicio cerrado</span></div></div><div class="list-meta"><strong>86</strong><span>80%</span></div></div></div></div></section>`;
}

function usersView() {
  return `<section class="card"><div class="search-toolbar"><div><div class="card-title">Directorio de usuarios</div><div class="card-subtitle">Personas con acceso a la operación EcoGo.</div></div><button class="primary-btn" data-action="add-user">＋ Nuevo usuario</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Usuario</th><th>Rol</th><th>Registro</th><th>Estado</th><th></th></tr></thead><tbody>${state.users.map(user => `<tr><td><div style="display:flex;align-items:center;gap:10px"><div class="avatar" style="width:31px;height:31px;border-radius:9px;font-size:10px">${initials(user.name)}</div><div><strong>${user.name}</strong><span class="table-secondary">${user.email}</span></div></div></td><td><span style="font-size:12px;font-weight:750">${user.role}</span></td><td><span style="font-size:12px">${user.joined}</span></td><td><span class="status status-completada">Activo</span></td><td><button class="table-action" data-action="edit-user">Editar</button></td></tr>`).join('')}</tbody></table></div></section><section class="content-grid grid-3 section-space">${state.collectors.map(collector => `<div class="card"><div style="display:flex;align-items:center;gap:10px"><div class="avatar">${collector.initials}</div><div><strong style="font-size:13px">${collector.name}</strong><div style="color:var(--muted);font-size:11px;margin-top:3px">${collector.phone}</div></div></div><div style="display:flex;justify-content:space-between;align-items:end;margin-top:18px"><div><div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;font-weight:800">Zona</div><div style="font-size:11px;margin-top:5px">${collector.zone}</div></div><span class="status ${collector.status === 'Disponible' ? 'status-completada' : 'status-en-camino'}">${collector.status}</span></div></div>`).join('')}</section>`;
}

function render() {
  app.innerHTML = state.authenticated ? shell() : loginScreen();
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-demo-role]').forEach(button => button.addEventListener('click', () => { state.role = button.dataset.demoRole; document.querySelectorAll('[data-demo-role]').forEach(item => item.classList.remove('active')); button.classList.add('active'); const email = document.querySelector('#login-email'); if (email) email.value = roleMeta[state.role].email; }));
  document.querySelector('#login-form')?.addEventListener('submit', event => { event.preventDefault(); state.authenticated = true; state.view = 'dashboard'; showToast('Sesión iniciada', `Explorando como ${currentUser().label}.`); render(); });
  document.querySelector('.password-toggle')?.addEventListener('click', event => { const input = document.querySelector('#login-password'); input.type = input.type === 'password' ? 'text' : 'password'; event.currentTarget.textContent = input.type === 'password' ? '◉' : '◌'; });
  document.querySelectorAll('[data-nav]').forEach(button => button.addEventListener('click', () => { state.view = button.dataset.nav; document.querySelector('#sidebar')?.classList.remove('open'); render(); }));
  document.querySelector('[data-logout]')?.addEventListener('click', () => { state.authenticated = false; render(); showToast('Sesión cerrada', 'Puedes volver a entrar cuando quieras.'); });
  document.querySelector('#role-switcher')?.addEventListener('change', event => { state.role = event.target.value; state.view = 'dashboard'; render(); showToast('Vista cambiada', `Ahora estás viendo el espacio de ${currentUser().label.toLowerCase()}.`); });
  document.querySelector('[data-mobile-menu]')?.addEventListener('click', () => document.querySelector('#sidebar')?.classList.toggle('open'));
  document.querySelector('#request-search')?.addEventListener('input', event => { state.requestSearch = event.target.value; render(); const input = document.querySelector('#request-search'); input.focus(); input.setSelectionRange(input.value.length, input.value.length); });
  document.querySelector('#request-status')?.addEventListener('change', event => { state.requestStatus = event.target.value; render(); });
  document.querySelectorAll('[data-request]').forEach(button => button.addEventListener('click', () => { state.selectedRequest = button.dataset.request; render(); }));
  document.querySelector('#request-form')?.addEventListener('submit', event => { event.preventDefault(); const form = event.currentTarget; const material = form.querySelector('#material').value; const kg = Number(form.querySelector('#quantity').value); const address = form.querySelector('#address').value; const dateValue = form.querySelector('#date').value; const date = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${dateValue}T12:00:00`)); const code = `ECO-${1050 + state.requests.length}`; state.requests.unshift({ code, material, kg, address, date, isoDate: dateValue, status: 'pendiente', collector: '', observations: form.querySelector('#observations').value, createdBy: currentUser().name, createdAt: 'Ahora' }); state.selectedRequest = code; state.view = 'requests'; showToast('Solicitud registrada', `Tu código de confirmación es ${code}.`); render(); });
  document.querySelectorAll('[data-assign]').forEach(button => button.addEventListener('click', () => { const code = button.dataset.assign; const collector = document.querySelector(`[data-assign-collector="${code}"]`).value; const dateInput = document.querySelector(`[data-assign-date="${code}"]`); if (!collector) { showToast('Falta un dato', 'Selecciona un recolector antes de asignar.'); return; } const request = state.requests.find(item => item.code === code); request.collector = collector; request.status = 'asignada'; request.isoDate = dateInput.value; request.date = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${dateInput.value}T12:00:00`)); showToast('Servicio asignado', `${code} fue asignada a ${collector}.`); render(); }));
  document.querySelectorAll('[data-update-collection]').forEach(button => button.addEventListener('click', () => { const code = button.dataset.updateCollection; const select = document.querySelector(`[data-collector-status="${code}"]`); const request = state.requests.find(item => item.code === code); const newStatus = select.value; if (newStatus === request.status) { showToast('Sin cambios', 'Selecciona un nuevo estado para actualizar el servicio.'); return; } request.status = newStatus; if (newStatus === 'completada') request.collectedKg = Math.max(1, Math.round(request.kg * .95)); showToast('Estado actualizado', `${code} ahora está ${statusLabel(newStatus).toLowerCase()}.`); render(); }));
  document.querySelectorAll('[data-action="refresh"]').forEach(button => button.addEventListener('click', () => showToast('Lista actualizada', 'Mostrando la información más reciente.')));
  document.querySelectorAll('[data-action="add-user"]').forEach(button => button.addEventListener('click', () => showToast('Función de demostración', 'En la siguiente iteración podrás crear usuarios desde este botón.')));
  document.querySelectorAll('[data-action="edit-user"]').forEach(button => button.addEventListener('click', () => showToast('Función de demostración', 'La edición de usuarios está representada en este prototipo.')));
}

render();
