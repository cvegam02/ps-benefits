# Spec — Pantalla de Detalle de Producto (Mobile)
**Fecha:** 2026-03-29
**Pantalla:** Vista "detalle" dentro del wizard `/app`
**Dispositivo:** Mobile (375×812px)

---

## Contexto

Esta pantalla aparece cuando el empleado toca cualquier producto en el catálogo. Es la vista `"detail"` que se agrega al wizard de `/app` entre `"catalog"` y `"cart"`. El flujo queda:

```
catalog → detail → cart → checkout → payment → qr
```

---

## Patrón de navegación

**Pantalla completa** — reemplaza el catálogo. Botón "← Regresar" en la navbar vuelve al catálogo. Consistente con el patrón Amazon/MercadoLibre.

---

## Estructura de la pantalla (top → bottom)

| Zona | Altura | Descripción |
|------|--------|-------------|
| Status bar | 44px | Igual que catálogo — azul `#2563EB`, hora + íconos |
| Navbar | 56px | Fondo blanco, "← Regresar" azul, ícono carrito con badge |
| Imagen del producto | 260px | Fondo `#F3F4F6`, imagen centrada, dots de galería (UI only) |
| Contenido scrollable | fill | Info, descripción, specs, disponibilidad |
| CTA fijo | 72px | Selector de cantidad + botón "Agregar al carrito" |

---

## Contenido scrollable (orden)

1. **Tag de categoría** — pill `#EFF6FF`, texto azul Montserrat 11px
2. **Nombre del producto** — Montserrat 700, 20px, `#1A1A1A`
3. **Rating** — estrellas estáticas (4.2 ★) + número en gris
4. **Precio** — precio con descuento Montserrat 700 26px + tachado gris 14px + badge "30% OFF" verde
5. **Descripción** — 2–3 líneas de texto mock, Montserrat 400 13px, `#6B7280`
6. **Especificaciones** — filas label/valor: Modelo, Color (pills), Almacenaje (pills), Garantía
7. **Disponibilidad** — punto verde `#059669` + "Disponible hoy en tienda"

### Pills seleccionables (Color y Almacenaje)
- Default: borde `#E5E7EB`, fondo blanco
- Seleccionado: borde `#2563EB`, fondo `#EFF6FF`, texto azul

---

## CTA fijo

```
[ − ] [ 1 ] [ + ]   [ Agregar al carrito  🛒 ]
```

- Fondo blanco, sombra top sutil
- Selector cantidad: 3 pills (−, número, +), borde `#E5E7EB`
- Botón: azul `#2563EB`, cornerRadius 20, fill_container, Montserrat 700

---

## Tipografía y colores

Consistente con catálogo existente en `app.pen`:
- Font: **Montserrat** en todos los textos
- Primario: `#2563EB`
- Texto principal: `#1A1A1A`
- Texto secundario: `#6B7280`
- Texto deshabilitado/tachado: `#9CA3AF`
- Verde éxito: `#059669`
- Bordes: `#E5E7EB`
- Fondo página: `#F9FAFB`

---

## Fuera de scope para el mockup

- Interacción real de pills (solo visual, una pill aparece seleccionada por default)
- Lógica de carrito real
- Múltiples imágenes en galería (solo imagen única con dots decorativos)
- Reviews/comentarios

---

## Posición en el canvas

Debajo del frame `MCAT` existente (x:0, y:870) para mantener agrupación lógica mobile.
