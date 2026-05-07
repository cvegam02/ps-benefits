// store-screens.jsx — Store back-office (desktop) screens
// Exports: StoreKanban, StoreOrderDetail

const SC = {
  blue: '#1e3a8a', blue2: '#1e40af', blue3: '#2563eb',
  pink: '#db2777', pink5: '#fdf2f8',
  amber: '#f59e0b', amber5: '#fffbeb',
  green: '#10b981', green5: '#ecfdf5',
  g50: '#f9fafb', g100: '#f3f4f6', g200: '#e5e7eb',
  g300: '#d1d5db', g400: '#9ca3af', g500: '#6b7280',
  g700: '#374151', g800: '#1f2937', g900: '#111827',
};

const Eb = ({ children, color = SC.pink }) => (
  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color, lineHeight: 1 }}>{children}</div>
);

const Pill = ({ kind = 'pending', children }) => {
  const styles = {
    pending: { bg: SC.amber5, fg: '#b45309', dot: SC.amber },
    ready: { bg: '#eff6ff', fg: SC.blue, dot: SC.blue3 },
    delivered: { bg: SC.green5, fg: '#047857', dot: SC.green },
  }[kind];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 9999, background: styles.bg, color: styles.fg, fontSize: 10, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
      <span style={{ width: 6, height: 6, borderRadius: 9999, background: styles.dot }} />{children}
    </span>
  );
};

// Sidebar
function Sidebar({ active = 'orders' }) {
  const items = [
    { id: 'dash', label: 'Panel', icon: <><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></> },
    { id: 'orders', label: 'Órdenes', icon: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>, count: 12 },
    { id: 'inv', label: 'Inventario', icon: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></> },
    { id: 'cust', label: 'Sindicatos', icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></> },
    { id: 'rep', label: 'Reportes', icon: <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></> },
    { id: 'set', label: 'Ajustes', icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></> },
  ];
  return (
    <div style={{ width: 240, background: SC.g900, color: '#fff', display: 'flex', flexDirection: 'column', padding: '20px 14px', gap: 24 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', color: SC.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Backoffice</div>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.015em' }}>Price Shoes</div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Eb color="rgba(255,255,255,0.4)">Operación</Eb>
        <div style={{ height: 6 }} />
        {items.map(it => (
          <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: active === it.id ? 'rgba(255,255,255,0.08)' : 'transparent', color: active === it.id ? '#fff' : 'rgba(255,255,255,0.7)', fontSize: 12.5, fontWeight: active === it.id ? 700 : 500, position: 'relative' }}>
            {active === it.id && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 2.5, borderRadius: 2, background: SC.pink }} />}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{it.icon}</svg>
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.count && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 9999, background: SC.pink, color: '#fff' }}>{it.count}</span>}
          </div>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9999, background: SC.pink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>MR</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>María Reyes</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Sucursal Hermosillo</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar({ title, subtitle, search }) {
  return (
    <div style={{ padding: '20px 28px', borderBottom: `1px solid ${SC.g100}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
      <div>
        <Eb>{subtitle}</Eb>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.025em', color: SC.g900, marginTop: 5 }}>{title}</div>
      </div>
      {search && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: SC.g50, border: `1px solid ${SC.g100}`, borderRadius: 12, padding: '9px 14px', width: 320, color: SC.g400 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span style={{ fontSize: 12, color: SC.g400, fontWeight: 500 }}>Buscar orden, cliente, sindicato…</span>
        </div>
      )}
    </div>
  );
}

// ─── KANBAN ───
function StoreKanban() {
  const cols = [
    {
      id: 'pending', title: 'Pendientes', kind: 'pending', count: 5, sum: '$8,420',
      orders: [
        { id: 'ORD-2410-008', who: 'Carlos Méndez · Sind. Energía', items: 3, total: '$1,447', date: 'Hoy 14:22', img: '1204452-1.jpg' },
        { id: 'ORD-2410-007', who: 'Lucía Vega · Sind. Maestros', items: 2, total: '$1,089', date: 'Hoy 13:45', img: '1218710-1.jpg' },
        { id: 'ORD-2410-006', who: 'Roberto Díaz · Sind. Salud', items: 5, total: '$2,815', date: 'Hoy 11:30', img: '1135759-0.jpg' },
        { id: 'ORD-2410-005', who: 'Ana Torres · Sind. PEMEX', items: 1, total: '$689', date: 'Hoy 10:12', img: '1222260-1.jpg' },
      ],
    },
    {
      id: 'ready', title: 'Listas para recoger', kind: 'ready', count: 4, sum: '$6,340',
      orders: [
        { id: 'ORD-2410-004', who: 'Patricia Luna · Sind. CFE', items: 2, total: '$1,233', date: 'Hoy 09:50', img: '1090089-1.jpg' },
        { id: 'ORD-2410-003', who: 'Jorge Silva · Sind. Energía', items: 3, total: '$1,876', date: 'Ayer 18:20', img: '1093845-1.jpg' },
        { id: 'ORD-2410-002', who: 'Mónica Ríos · Sind. Maestros', items: 1, total: '$559', date: 'Ayer 16:10', img: '1222278-1.jpg' },
      ],
    },
    {
      id: 'delivered', title: 'Entregadas', kind: 'delivered', count: 3, sum: '$3,891',
      orders: [
        { id: 'ORD-2410-001', who: 'Daniel Cruz · Sind. PEMEX', items: 2, total: '$1,205', date: 'Ayer 14:05', img: '1204452-1.jpg' },
        { id: 'ORD-2409-088', who: 'Sofía Hernández · Salud', items: 4, total: '$2,140', date: 'Ayer 10:30', img: '1218710-1.jpg' },
      ],
    },
  ];
  return (
    <div style={{ display: 'flex', minHeight: '100%', fontFamily: 'Montserrat, sans-serif' }}>
      <Sidebar active="orders" />
      <div style={{ flex: 1, background: SC.g50, display: 'flex', flexDirection: 'column' }}>
        <TopBar title="Tablero de Órdenes" subtitle="Operación · Hermosillo Norte" search />
        {/* Filters */}
        <div style={{ padding: '16px 28px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          {['Hoy', 'Esta semana', 'Este mes', 'Todo'].map((f, i) => (
            <div key={f} style={{ padding: '7px 14px', borderRadius: 9999, fontSize: 11, fontWeight: 700, background: i === 0 ? SC.blue : '#fff', color: i === 0 ? '#fff' : SC.g700, border: `1px solid ${i === 0 ? SC.blue : SC.g100}` }}>{f}</div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <div style={{ padding: '7px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: '#fff', color: SC.g700, border: `1px solid ${SC.g100}`, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filtros
            </div>
            <div style={{ padding: '7px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: SC.pink, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Nueva orden
            </div>
          </div>
        </div>
        {/* Board */}
        <div style={{ padding: '20px 28px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, flex: 1 }}>
          {cols.map(col => (
            <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
              {/* Col header */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Pill kind={col.kind}>{col.title}</Pill>
                  <span style={{ fontSize: 11, fontWeight: 700, color: SC.g500 }}>{col.count}</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: SC.g400, letterSpacing: '0.05em' }}>{col.sum}</div>
              </div>
              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.orders.map((o, i) => (
                  <div key={i} style={{ background: '#fff', border: `1px solid ${SC.g100}`, borderRadius: 14, padding: 12, display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 1px 0 rgba(17,24,39,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'ui-monospace, monospace', color: SC.g900, letterSpacing: '0.05em' }}>{o.id}</span>
                      <span style={{ fontSize: 10, color: SC.g400, fontWeight: 600 }}>{o.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 9, background: SC.g50, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={`../assets/products/${o.img}`} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: SC.g900, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.who}</div>
                        <div style={{ fontSize: 10, color: SC.g500, fontWeight: 500, marginTop: 2 }}>{o.items} {o.items === 1 ? 'producto' : 'productos'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, borderTop: `1px dashed ${SC.g200}` }}>
                      <span style={{ fontSize: 13, fontWeight: 900, color: SC.blue, letterSpacing: '-0.03em' }}>{o.total}</span>
                      {col.kind === 'pending' && <span style={{ fontSize: 9.5, fontWeight: 800, color: SC.pink, letterSpacing: '0.05em' }}>PREPARAR →</span>}
                      {col.kind === 'ready' && <span style={{ fontSize: 9.5, fontWeight: 800, color: SC.blue, letterSpacing: '0.05em' }}>ENTREGAR →</span>}
                      {col.kind === 'delivered' && <span style={{ fontSize: 9.5, fontWeight: 700, color: SC.g400, letterSpacing: '0.05em' }}>VER DETALLE</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ORDER DETAIL ───
function StoreOrderDetail() {
  const items = [
    { img: '1204452-1.jpg', name: 'Kit Tenis Slip On Casual Negro', sku: 'PS-1204452', meta: 'Talla 27 · Negro', qty: 1, price: 433 },
    { img: '1218710-1.jpg', name: 'Chamarra NFL Cowboys Reversible', sku: 'PS-1218710', meta: 'Talla M · Azul/Plata', qty: 1, price: 1014 },
  ];
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const benefit = Math.round(subtotal * 0.30);
  const total = subtotal - benefit;
  return (
    <div style={{ display: 'flex', minHeight: '100%', fontFamily: 'Montserrat, sans-serif' }}>
      <Sidebar active="orders" />
      <div style={{ flex: 1, background: SC.g50, display: 'flex', flexDirection: 'column' }}>
        {/* breadcrumbs + topbar */}
        <div style={{ padding: '20px 28px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: SC.g400, marginBottom: 12 }}>
            <span>Órdenes</span>
            <span>/</span>
            <span>Pendientes</span>
            <span>/</span>
            <span style={{ color: SC.g900 }}>ORD-2410-008</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, paddingBottom: 18, borderBottom: `1px solid ${SC.g100}` }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.025em', color: SC.g900, fontFamily: 'ui-monospace, monospace' }}>ORD-2410-008</span>
                <Pill kind="pending">Pendiente</Pill>
              </div>
              <div style={{ fontSize: 12, color: SC.g500, fontWeight: 500, marginTop: 6 }}>Creada 24 Oct 2024 · 14:22 · Sucursal Hermosillo Norte</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ padding: '10px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: '#fff', color: SC.g700, border: `1px solid ${SC.g100}` }}>Imprimir</div>
              <div style={{ padding: '10px 18px', borderRadius: 10, fontSize: 11, fontWeight: 800, background: SC.pink, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(219,39,119,0.2)' }}>Marcar Lista</div>
            </div>
          </div>
        </div>
        {/* body */}
        <div style={{ padding: '20px 28px 28px', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', border: `1px solid ${SC.g100}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${SC.g100}`, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Eb color={SC.g500}>Productos · {items.length}</Eb>
                <span style={{ fontSize: 11, fontWeight: 700, color: SC.g500 }}>2 SKUs</span>
              </div>
              {items.map((it, i) => (
                <div key={i} style={{ padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center', borderBottom: i < items.length - 1 ? `1px solid ${SC.g100}` : 'none' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 12, background: SC.g50, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={`../assets/products/${it.img}`} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: SC.g400, letterSpacing: '0.18em', fontFamily: 'ui-monospace, monospace' }}>{it.sku}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: SC.g900, marginTop: 3, letterSpacing: '-0.005em' }}>{it.name}</div>
                    <div style={{ fontSize: 11, color: SC.g500, fontWeight: 500, marginTop: 3 }}>{it.meta}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: SC.g400, letterSpacing: '0.1em' }}>QTY {it.qty}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: SC.g900, letterSpacing: '-0.03em', marginTop: 4 }}>${it.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div style={{ background: '#fff', border: `1px solid ${SC.g100}`, borderRadius: 16, padding: 18 }}>
              <Eb color={SC.g500}>Línea de tiempo</Eb>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
                {[
                  { t: 'Orden creada', who: 'Carlos Méndez · App Móvil', when: '24 Oct · 14:22', done: true, color: SC.green },
                  { t: 'Pago confirmado', who: 'Stripe · Tarjeta •• 4242', when: '24 Oct · 14:23', done: true, color: SC.green },
                  { t: 'En preparación', who: 'María Reyes · Sucursal', when: 'En curso', done: false, color: SC.amber },
                  { t: 'Listo para recoger', who: '—', when: 'Pendiente', done: false, color: SC.g300 },
                  { t: 'Entregado', who: '—', when: 'Pendiente', done: false, color: SC.g300 },
                ].map((step, i, arr) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: 16, height: 16, borderRadius: 9999, background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: step.done ? `0 0 0 4px ${SC.green5}` : 'none' }}>
                        {step.done && <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,5 4,7 8,3"/></svg>}
                      </div>
                      {i < arr.length - 1 && <div style={{ width: 1.5, flex: 1, background: SC.g200, marginTop: 2, minHeight: 20 }} />}
                    </div>
                    <div style={{ paddingBottom: 4, flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: step.done ? SC.g900 : SC.g500 }}>{step.t}</div>
                      <div style={{ fontSize: 10.5, color: SC.g500, fontWeight: 500, marginTop: 2 }}>{step.who} · <span style={{ fontWeight: 700, color: step.done ? SC.g700 : SC.g400 }}>{step.when}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Customer */}
            <div style={{ background: '#fff', border: `1px solid ${SC.g100}`, borderRadius: 16, padding: 18 }}>
              <Eb color={SC.g500}>Cliente</Eb>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 9999, background: SC.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em' }}>CM</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: SC.g900, letterSpacing: '-0.01em' }}>Carlos Méndez Ortiz</div>
                  <div style={{ fontSize: 10.5, color: SC.g500, fontWeight: 500 }}>Empleado #ENG-0042</div>
                </div>
              </div>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                  <span style={{ color: SC.g500, fontWeight: 500 }}>Sindicato</span>
                  <span style={{ color: SC.g900, fontWeight: 700 }}>Energía Eléctrica</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                  <span style={{ color: SC.g500, fontWeight: 500 }}>Credencial</span>
                  <span style={{ color: SC.g900, fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>PS-2024-0042</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                  <span style={{ color: SC.g500, fontWeight: 500 }}>Teléfono</span>
                  <span style={{ color: SC.g900, fontWeight: 700 }}>+52 662 123 4567</span>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div style={{ background: '#fff', border: `1px solid ${SC.g100}`, borderRadius: 16, padding: 18 }}>
              <Eb color={SC.g500}>Resumen</Eb>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: SC.g500, fontWeight: 500 }}>Subtotal</span>
                  <span style={{ color: SC.g900, fontWeight: 700 }}>${subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: SC.pink, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, background: SC.pink, transform: 'rotate(45deg)', borderRadius: 1 }} />
                    Beneficio sindical (30%)
                  </span>
                  <span style={{ color: SC.pink, fontWeight: 700 }}>−${benefit.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: SC.g500, fontWeight: 500 }}>Envío</span>
                  <span style={{ color: SC.g900, fontWeight: 700 }}>Recoger en sucursal</span>
                </div>
                <div style={{ height: 1, background: SC.g100, margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: SC.g500, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: SC.blue, letterSpacing: '-0.04em', fontFeatureSettings: '"tnum"' }}>${total.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 10.5, color: SC.g500, fontWeight: 500, textAlign: 'right' }}>12 MSI · Tarjeta •• 4242</div>
              </div>
            </div>

            {/* Note */}
            <div style={{ background: SC.amber5, border: '1px solid #fde68a', borderRadius: 16, padding: 14, display: 'flex', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: SC.amber, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: '#92400e', letterSpacing: '-0.005em' }}>Verificar talla</div>
                <div style={{ fontSize: 11, color: '#78350f', fontWeight: 500, marginTop: 3, lineHeight: 1.45 }}>Cliente solicitó probar talla 27 antes de empacar.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StoreKanban, StoreOrderDetail });
