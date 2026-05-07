// shop-screens.jsx — Shop (employee mobile) screens
// Exports: ShopHome, ShopProduct, ShopCart, ShopConfirm

const C = {
  blue: '#1e3a8a', pink: '#db2777', pink5: '#fdf2f8',
  blue5: '#eff6ff', blue3: '#93c5fd',
  g50: '#f9fafb', g100: '#f3f4f6', g200: '#e5e7eb',
  g400: '#9ca3af', g500: '#6b7280', g700: '#374151', g900: '#111827',
};

const Eyebrow = ({ children, color = C.pink }) => (
  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color, lineHeight: 1 }}>{children}</div>
);

const Status = ({ kind = 'pending', children }) => {
  const colors = {
    pending: { fg: '#b45309', bg: '#f59e0b' },
    ready: { fg: C.blue, bg: C.blue },
    delivered: { fg: '#047857', bg: '#10b981' },
  }[kind];
  const ic = kind === 'pending'
    ? <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="2" fill="#fff"/></svg>
    : <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,5 4,7 8,3"/></svg>;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '700 12px/1 Montserrat', color: colors.fg, letterSpacing: '-0.005em' }}>
      <span style={{ width: 14, height: 14, borderRadius: 9999, background: colors.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{ic}</span>
      {children}
    </span>
  );
};

const Lockup = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '6px 12px 6px 6px' }}>
    <div style={{ width: 32, height: 32, borderRadius: 9, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blue }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
    </div>
    <div style={{ lineHeight: 1.1 }}>
      <div style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.blue3, lineHeight: 1, marginBottom: 4 }}>
        <span style={{ display: 'inline-block', width: 3, height: 3, borderRadius: 9999, background: C.pink, verticalAlign: 'middle', marginRight: 5, marginBottom: 2 }} />
        Price Shoes Benefits
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.015em', color: '#fff', lineHeight: 1 }}>Sindicato Energía</div>
    </div>
  </div>
);

const IconBtn = ({ children, count }) => (
  <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
    {children}
    {count !== undefined && (
      <div style={{ position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 9999, background: C.pink, color: '#fff', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{count}</div>
    )}
  </div>
);

const ShopHeader = ({ cart = 2 }) => (
  <div style={{ background: C.blue, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
    <Lockup />
    <div style={{ display: 'flex', gap: 6 }}>
      <IconBtn><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg></IconBtn>
      <IconBtn count={cart}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></IconBtn>
    </div>
  </div>
);

const BottomNav = ({ active = 'home' }) => {
  const items = [
    { id: 'home', label: 'Inicio', icon: <path d="M3 12l9-9 9 9M5 10v10h14V10"/> },
    { id: 'search', label: 'Buscar', icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></> },
    { id: 'cart', label: 'Carrito', icon: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></> },
    { id: 'me', label: 'Yo', icon: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
  ];
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 14px 30px', background: 'linear-gradient(to top, #fff 60%, rgba(255,255,255,0))' }}>
      <div style={{ background: '#fff', borderRadius: 22, padding: 6, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)', border: `1px solid ${C.g100}` }}>
        {items.map(it => (
          <div key={it.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 0', borderRadius: 14, background: active === it.id ? C.blue : 'transparent', color: active === it.id ? '#fff' : C.g400, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{it.icon}</svg>
            {it.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── HOME ───
function ShopHome() {
  const cats = [
    { id: 'all', emoji: '✨', label: 'Todo', active: true },
    { id: 'shoes', emoji: '👟', label: 'Calzado' },
    { id: 'clothes', emoji: '👕', label: 'Ropa' },
    { id: 'acc', emoji: '👜', label: 'Accesorios' },
    { id: 'sport', emoji: '⚽', label: 'Deportes' },
  ];
  const products = [
    { img: '1204452-1.jpg', cat: 'CALZADO', name: 'Kit Tenis Slip On', price: 433, was: 619 },
    { img: '1218710-1.jpg', cat: 'ROPA', name: 'Chamarra NFL Cowboys', price: 1014, was: 1449 },
    { img: '1222260-1.jpg', cat: 'CALZADO', name: 'Tenis Reebok Classic', price: 689, was: 989 },
    { img: '1135759-0.jpg', cat: 'ACCESORIOS', name: 'Bolsa Aldo Negra', price: 559, was: 799 },
  ];
  return (
    <div style={{ background: '#fff', minHeight: '100%', position: 'relative', paddingBottom: 100, fontFamily: 'Montserrat, sans-serif' }}>
      <ShopHeader cart={2} />
      {/* Hero benefit */}
      <div style={{ padding: '18px 16px 14px' }}>
        <div style={{ borderRadius: 24, padding: '20px 18px', background: `linear-gradient(135deg, ${C.blue} 0%, #2563eb 100%)`, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <Eyebrow color="#f9a8d4">Beneficio del mes</Eyebrow>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.025em', marginTop: 6, lineHeight: 1.1 }}>30% en todo<br/>el catálogo</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.blue3, marginTop: 8 }}>Hasta 12 MSI · Termina 31 Dic</div>
          <div style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: 10, background: C.pink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px -4px rgba(219,39,119,0.5)' }}>
            <span style={{ width: 12, height: 12, background: '#fff', transform: 'rotate(45deg)', borderRadius: 2 }} />
          </div>
        </div>
      </div>
      {/* Categories */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {cats.map(c => (
          <div key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 9999, background: c.active ? C.blue : '#fff', color: c.active ? '#fff' : C.g700, border: `1px solid ${c.active ? C.blue : C.g100}`, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
            <span>{c.emoji}</span>{c.label}
          </div>
        ))}
      </div>
      {/* Section title */}
      <div style={{ padding: '6px 16px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <Eyebrow>Catálogo Completo</Eyebrow>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em', color: C.g900, marginTop: 4 }}>Descubre tus Beneficios</div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.blue, letterSpacing: '0.05em' }}>VER TODO</div>
      </div>
      {/* Grid */}
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {products.map((p, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${C.g100}`, borderRadius: 24, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ aspectRatio: '1', background: C.g50, borderRadius: 18, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={`../assets/products/${p.img}`} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
              <div style={{ position: 'absolute', top: 6, left: 6, padding: '3px 8px', borderRadius: 7, background: C.pink5, color: C.pink, border: '1px solid #fce7f3', fontSize: 9, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, background: C.pink, transform: 'rotate(45deg)', borderRadius: 1 }} />30%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, color: C.pink, letterSpacing: '0.2em' }}>{p.cat}</div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: C.g900, lineHeight: 1.2, marginTop: 3 }}>{p.name}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.04em', color: C.blue }}>${p.price}</span>
              <span style={{ fontSize: 10, color: C.g400, textDecoration: 'line-through', fontWeight: 500 }}>${p.was}</span>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="home" />
    </div>
  );
}

// ─── PRODUCT ───
function ShopProduct() {
  return (
    <div style={{ background: '#fff', minHeight: '100%', position: 'relative', paddingBottom: 100, fontFamily: 'Montserrat, sans-serif' }}>
      <ShopHeader cart={2} />
      {/* Image */}
      <div style={{ background: C.g50, padding: '16px', position: 'relative' }}>
        <div style={{ aspectRatio: '1', borderRadius: 28, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
          <img src="../assets/products/1204452-1.jpg" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
        </div>
        <div style={{ position: 'absolute', top: 28, right: 28, padding: '6px 12px', borderRadius: 9999, background: '#fff', color: C.pink, fontSize: 10, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <span style={{ width: 6, height: 6, background: C.pink, transform: 'rotate(45deg)', borderRadius: 1 }} />30% OFF
        </div>
      </div>
      {/* Info */}
      <div style={{ padding: '20px 18px 12px' }}>
        <Eyebrow>Calzado · Casual</Eyebrow>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: C.g900, marginTop: 6, lineHeight: 1.15 }}>Kit Tenis Slip On Casual Negro</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
          <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.04em', color: C.blue }}>$433</span>
          <span style={{ fontSize: 14, color: C.g400, textDecoration: 'line-through', fontWeight: 500 }}>$619</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: C.pink, padding: '3px 8px', borderRadius: 7, background: C.pink5, border: '1px solid #fce7f3' }}>Ahorras $186</span>
        </div>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: C.g500, marginTop: 6 }}>o 12 pagos de $36 sin intereses</div>
      </div>
      {/* Sizes */}
      <div style={{ padding: '4px 18px 12px' }}>
        <Eyebrow color={C.g400}>Talla</Eyebrow>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {[24, 25, 26, 27, 28].map(s => (
            <div key={s} style={{ width: 44, height: 44, borderRadius: 12, border: `1.5px solid ${s === 27 ? C.blue : C.g200}`, background: s === 27 ? C.blue : '#fff', color: s === 27 ? '#fff' : C.g700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{s}</div>
          ))}
        </div>
      </div>
      {/* Description */}
      <div style={{ padding: '8px 18px' }}>
        <Eyebrow color={C.g400}>Descripción</Eyebrow>
        <p style={{ fontSize: 12.5, color: C.g700, lineHeight: 1.5, marginTop: 8 }}>Tenis tipo slip on, parte superior textil con detalles cosidos. Suela de hule antiderrapante. Ideal para uso diario. Color negro.</p>
      </div>
      {/* CTA bar */}
      <div style={{ position: 'absolute', bottom: 90, left: 14, right: 14, background: '#fff', borderRadius: 18, padding: 10, display: 'flex', gap: 8, boxShadow: '0 12px 32px rgba(0,0,0,0.12)', border: `1px solid ${C.g100}` }}>
        <button style={{ flex: '0 0 auto', width: 48, height: 48, borderRadius: 12, background: '#fff', border: `2px solid ${C.g100}`, color: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>
        </button>
        <button style={{ flex: 1, padding: '14px 0', borderRadius: 12, background: C.pink, color: '#fff', fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', boxShadow: '0 8px 24px rgba(219,39,119,0.25)' }}>Añadir al Carrito · $433</button>
      </div>
      <BottomNav active="search" />
    </div>
  );
}

// ─── CART ───
function ShopCart() {
  const items = [
    { img: '1204452-1.jpg', cat: 'CALZADO', name: 'Kit Tenis Slip On Casual', meta: 'Talla 27 · Negro', price: 433, qty: 1 },
    { img: '1218710-1.jpg', cat: 'ROPA', name: 'Chamarra NFL Cowboys', meta: 'Talla M · Azul', price: 1014, qty: 1 },
  ];
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div style={{ background: C.g50, minHeight: '100%', position: 'relative', paddingBottom: 200, fontFamily: 'Montserrat, sans-serif' }}>
      <ShopHeader cart={2} />
      <div style={{ padding: '20px 16px 12px' }}>
        <Eyebrow>Mi Carrito</Eyebrow>
        <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', color: C.g900, marginTop: 4 }}>2 productos</div>
      </div>
      <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${C.g100}`, borderRadius: 18, padding: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: C.g50, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={`../assets/products/${it.img}`} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: C.pink, letterSpacing: '0.2em' }}>{it.cat}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.g900, lineHeight: 1.2, marginTop: 2 }}>{it.name}</div>
              <div style={{ fontSize: 10, color: C.g500, fontWeight: 500, marginTop: 3 }}>{it.meta}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', background: C.g50, borderRadius: 10, padding: 2 }}>
                  <button style={{ width: 22, height: 22, borderRadius: 7, background: '#fff', border: `1px solid ${C.g100}`, color: C.blue, fontSize: 11, fontWeight: 700 }}>−</button>
                  <span style={{ padding: '0 8px', fontSize: 11, fontWeight: 700, color: C.g900 }}>{it.qty}</span>
                  <button style={{ width: 22, height: 22, borderRadius: 7, background: '#fff', border: `1px solid ${C.g100}`, color: C.blue, fontSize: 11, fontWeight: 700 }}>+</button>
                </div>
                <span style={{ fontSize: 14, fontWeight: 900, color: C.blue, letterSpacing: '-0.03em' }}>${it.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Discount summary */}
      <div style={{ margin: '16px 14px 0', padding: '14px 16px', background: `linear-gradient(135deg, ${C.pink5}, ${C.blue5})`, border: '1px solid #f3e8f4', borderRadius: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, background: C.pink, transform: 'rotate(45deg)', borderRadius: 2 }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: C.pink, letterSpacing: '-0.005em' }}>Beneficio aplicado · 30% OFF</span>
        </div>
        <div style={{ fontSize: 11, color: C.g700, fontWeight: 500, marginTop: 5 }}>Estás ahorrando <span style={{ fontWeight: 800, color: C.pink }}>$621</span> con tu credencial.</div>
      </div>
      {/* Bottom checkout */}
      <div style={{ position: 'absolute', bottom: 80, left: 14, right: 14, background: '#fff', borderRadius: 20, padding: 14, boxShadow: '0 16px 40px rgba(0,0,0,0.12)', border: `1px solid ${C.g100}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Eyebrow color={C.g400}>Total a pagar</Eyebrow>
          <span style={{ fontSize: 22, fontWeight: 900, color: C.blue, letterSpacing: '-0.04em' }}>${subtotal.toLocaleString()}</span>
        </div>
        <div style={{ fontSize: 10, color: C.g500, fontWeight: 500, marginTop: 3 }}>o 12 pagos de ${Math.round(subtotal/12)} sin intereses</div>
        <button style={{ width: '100%', padding: '14px 0', borderRadius: 14, background: C.pink, color: '#fff', fontSize: 12, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', marginTop: 12, boxShadow: '0 8px 24px rgba(219,39,119,0.25)' }}>Pagar Ahora →</button>
      </div>
      <BottomNav active="cart" />
    </div>
  );
}

// ─── CONFIRM ───
function ShopConfirm() {
  return (
    <div style={{ background: '#fff', minHeight: '100%', position: 'relative', paddingBottom: 100, fontFamily: 'Montserrat, sans-serif' }}>
      <ShopHeader cart={0} />
      <div style={{ padding: '32px 20px 0', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 9999, background: '#d1fae5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#047857' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <Eyebrow color="#047857">Orden confirmada</Eyebrow>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: C.g900, marginTop: 6, lineHeight: 1.15 }}>¡Listo, Carlos!<br/>Tu orden está en camino</div>
        <div style={{ fontSize: 12, color: C.g500, marginTop: 8, fontWeight: 500 }}>Pasa a recoger en tu sucursal con este código.</div>
      </div>
      {/* QR card */}
      <div style={{ margin: '20px 18px 0', background: '#fff', borderRadius: 24, padding: 20, border: `1px solid ${C.g100}`, boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div>
            <Eyebrow color={C.g400}>Orden</Eyebrow>
            <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'ui-monospace, monospace', color: C.g900, letterSpacing: '0.05em', marginTop: 3 }}>ORD-2410-001</div>
          </div>
          <Status kind="ready">Listo para recoger</Status>
        </div>
        {/* Fake QR */}
        <div style={{ aspectRatio: '1', maxWidth: 200, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 25 25" width="100%" height="100%" style={{ imageRendering: 'pixelated' }}>
            {(() => {
              const cells = [];
              const seed = [0,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,1,0,1,1,0,1];
              for (let y = 0; y < 25; y++) for (let x = 0; x < 25; x++) {
                const v = seed[(x*7+y*3+x*y) % seed.length];
                if (v) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={C.g900}/>);
              }
              // corner squares
              const corner = (cx, cy) => [
                <rect key={`c1${cx}${cy}`} x={cx} y={cy} width="7" height="7" fill="#fff"/>,
                <rect key={`c2${cx}${cy}`} x={cx} y={cy} width="7" height="7" fill="none" stroke={C.g900} strokeWidth="1"/>,
                <rect key={`c3${cx}${cy}`} x={cx+2} y={cy+2} width="3" height="3" fill={C.g900}/>,
              ];
              return [...cells, ...corner(0,0), ...corner(18,0), ...corner(0,18)];
            })()}
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: `1px dashed ${C.g200}` }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.g400, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Sucursal</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.g900, marginTop: 2 }}>Hermosillo Norte</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.g400, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Total</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.blue, letterSpacing: '-0.04em', marginTop: 1 }}>$1,447</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 18px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button style={{ padding: '12px 0', borderRadius: 14, background: '#fff', color: C.blue, fontSize: 11, fontWeight: 800, border: `2px solid ${C.g100}`, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Ver Mis Órdenes</button>
      </div>
      <BottomNav active="me" />
    </div>
  );
}

Object.assign(window, { ShopHome, ShopProduct, ShopCart, ShopConfirm });
