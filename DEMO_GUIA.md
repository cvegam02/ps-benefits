# Price Shoes Benefits — Guía del Demo

> Documento de referencia para socios de negocio.
> No se requieren conocimientos técnicos para leerlo.

---

## ¿Qué es Price Shoes Benefits?

Es una plataforma digital que permite a los empleados de empresas afiliadas comprar productos de tecnología con descuentos exclusivos, negociados previamente entre sus empresas y Price Shoes Benefits.

La plataforma tiene **dos caras**:

| Vista | ¿Quién la usa? | ¿Para qué? |
|---|---|---|
| **Portal del Empleado** | El trabajador desde su celular o computadora | Explorar productos, comprar y recibir su pedido |
| **Panel de Tienda** | El personal de la sucursal Price Shoes Benefits | Ver y gestionar los pedidos que llegan |

Ambas vistas están conectadas en tiempo real: cuando un empleado hace un pedido, aparece inmediatamente en el panel de la tienda.

---

## Conceptos clave

### Empresa afiliada (Tenant)
Es la organización que tiene convenio con Price Shoes Benefits. En el demo hay cuatro empresas de ejemplo:

| Empresa | Descuento negociado |
|---|---|
| Sindicato Energía | 30% en todo el catálogo |
| Grupo Santa | 25% en todo el catálogo |
| Demo Corp | 20% en todo el catálogo |
| Tech Alianza | 15% en todo el catálogo |

El descuento se aplica automáticamente a todos los empleados de esa empresa. No necesitan hacer nada especial para obtenerlo.

### Empleado (Usuario)
Cualquier trabajador registrado bajo una empresa afiliada. En el demo el usuario de prueba es:

- **Nombre:** Carlos Vega
- **Empresa:** Sindicato Energía (30% de descuento)
- **Correo:** carlos@test.com
- **Contraseña:** 123456

---

## Flujo del empleado — paso a paso

### 1. Inicio de sesión
El empleado entra con su correo y contraseña. El sistema lo reconoce, identifica a qué empresa pertenece y carga automáticamente su descuento.

> **¿Por qué se pide número de empleado?**
> Es el identificador interno que vincula al usuario con su empresa. Permite que Price Shoes Benefits valide que la persona efectivamente pertenece a la organización y tiene derecho al beneficio.

---

### 2. Explorar el catálogo
Una vez dentro, el empleado ve el catálogo completo de productos. Todos los precios ya muestran el descuento aplicado.

- Puede filtrar por categoría: Electrónica, Computación, Audio, Wearables.
- Puede buscar por nombre de producto.
- Puede ver la vista en lista o en mosaico.

> **¿Por qué se muestra el precio original tachado?**
> Para que el empleado vea claramente cuánto está ahorrando. Es una comunicación de valor, no solo un precio.

---

### 3. Detalle del producto
Al tocar un producto, se abre su ficha con descripción completa, precio con descuento, y las opciones de añadir al carrito o comprar de inmediato.

---

### 4. Carrito de compras
El empleado puede agregar varios productos antes de pagar. En el carrito ve:

- Cada producto con su precio con descuento.
- El subtotal a precio de lista (precio original).
- El ahorro total en pesos.
- El **total a pagar** ya con el descuento aplicado.

> **¿Por qué mostrar el subtotal original si no es lo que se cobra?**
> Refuerza el valor del beneficio. Ver "$16,000 → $11,200" comunica mejor el ahorro que solo ver el precio final.

---

### 5. Datos de envío / recolección
El empleado confirma sus datos antes de proceder al pago. En esta versión del demo el modelo es de **recolección en tienda**: el empleado recoge su pedido en la sucursal Price Shoes Benefits más cercana.

---

### 6. Método de pago
El empleado elige cómo quiere pagar. Las opciones disponibles en el demo son:

| Método | Descripción |
|---|---|
| Tarjeta crédito / débito | Pago inmediato con tarjeta |
| OXXO Pay | Genera una referencia para pagar en efectivo en OXXO |
| SPEI / Transferencia | Transferencia bancaria |
| Meses sin intereses | Financiamiento en parcialidades |
| Mercado Pago | Pago a través de la plataforma Mercado Pago |

> En el demo no se procesa ningún cobro real. La pantalla de "procesando" simula el tiempo de respuesta de un banco y siempre termina exitosamente.

---

### 7. Código QR del pedido
Una vez confirmado el pago, el sistema genera un **código QR único** para el pedido. Este código es la "llave" que el empleado presenta físicamente en la tienda para recoger su compra.

> **¿Por qué un QR y no solo un número de orden?**
> El QR acelera el proceso en tienda: el personal solo apunta la cámara y el sistema identifica el pedido en segundos, sin necesidad de buscar manualmente ni teclear nada.

---

### 8. Perfil del empleado
Desde la sección de perfil, el empleado puede consultar:

- Su información personal y de empresa.
- El historial completo de pedidos.
- Cuánto ha ahorrado en total gracias al beneficio.

---

## Flujo del personal de tienda — paso a paso

El panel de tienda está diseñado para que el personal gestione los pedidos de forma visual y rápida, sin necesidad de capacitación extensa.

### Vista Kanban (tablero de columnas)

Los pedidos se organizan automáticamente en tres columnas según su estado:

```
[ PENDIENTES ]     [ LISTOS PARA RECOGER ]     [ ENTREGADOS ]
  ORD-001            ORD-002                      ORD-003
  ORD-004            ORD-005                      ...
  ...
```

El personal de tienda solo necesita mover cada pedido de columna en columna conforme avanza el proceso.

---

### Estados de un pedido

| Estado | Significa | Acción disponible |
|---|---|---|
| **Pendiente** | El cliente pagó, el pedido está en preparación | Botón "Marcar como Listo" |
| **Listo para recoger** | El pedido está preparado y esperando al cliente | Botón "Escanear QR" |
| **Entregado** | El cliente ya recogió su pedido | Sin acción (histórico) |

---

### ¿Cómo se entrega un pedido?

1. El pedido llega en estado **Pendiente** — el personal lo prepara.
2. Una vez listo, presiona **"Marcar como Listo"**. El pedido se mueve a la columna del centro.
3. Cuando el cliente llega a la tienda, el personal presiona **"Escanear QR"**.
4. Se abre la cámara del dispositivo. El cliente muestra su QR en la pantalla del celular.
5. El sistema valida el QR, identifica el pedido, y el personal confirma la entrega.
6. El pedido se mueve automáticamente a **Entregado**.

> **¿Por qué el proceso requiere escanear QR y no solo confirmar manualmente?**
> El QR garantiza que la persona que recoge es quien realizó el pedido. Evita errores de entrega y fraudes.

---

### Buscar un pedido

En la barra de búsqueda del panel se puede buscar por nombre del cliente o por número de orden (por ejemplo "Carlos" o "ORD-001"). Útil cuando hay muchos pedidos activos.

---

### Detalle de un pedido

Al tocar cualquier tarjeta de pedido, se abre un panel lateral con:

- Nombre y empresa del cliente.
- Descuento aplicado y método de pago.
- Lista detallada de productos con precio unitario, precio original y subtotal por producto.
- Resumen del ahorro total y el monto cobrado.
- Botón de acción según el estado actual del pedido.

---

## Resumen del flujo completo

```
EMPLEADO                                    TIENDA
   │                                           │
   │  1. Inicia sesión                         │
   │  2. Explora el catálogo con descuento     │
   │  3. Agrega productos al carrito           │
   │  4. Confirma y elige método de pago       │
   │  5. Paga ──────────────────────────────► Aparece en "Pendientes"
   │  6. Recibe código QR                      │
   │                                           │  7. Personal prepara el pedido
   │                                           │  8. Marca como "Listo"
   │  9. Va a la tienda y muestra QR ─────────►│
   │                                           │  10. Escanean el QR
   │  10. Recibe sus productos ◄───────────────│  11. Confirman entrega → "Entregado"
```

---

## Lo que este demo demuestra

1. **Experiencia del empleado**: flujo completo de compra en menos de 2 minutos, desde ver el catálogo hasta tener el QR en mano.
2. **Gestión operativa en tienda**: el personal no necesita un sistema complejo — tres columnas, un botón, un escaneo.
3. **Propuesta de valor visible**: en cada pantalla el empleado ve exactamente cuánto está ahorrando.
4. **Personalización por empresa**: cada empresa tiene su propio descuento y los empleados solo ven lo que les corresponde.
5. **Trazabilidad completa**: cada pedido queda registrado con fecha, cliente, empresa, productos y método de pago.

---

## Datos del demo (para usar durante la presentación)

**Usuario de prueba:**
- Correo: `carlos@test.com`
- Contraseña: `123456`
- Empresa: Sindicato Energía — **30% de descuento**

**Pedidos precargados en el panel de tienda:**
- ORD-001 — Carlos Vega — Smartphone + Laptop — **Pendiente**
- ORD-002 — Ana López — Audífonos + Smartwatch — **Listo para recoger**
- ORD-003 — Luis Mora — 2 Laptops + Tablet — **Entregado**
- ORD-004 — Sofía Ramírez — Monitor + Teclado — **Pendiente**
- ORD-005 — Marco Fuentes — Tablet — **Listo para recoger**

> Cualquier pedido nuevo que se genere desde el portal del empleado aparecerá automáticamente en el panel de tienda.

---

*Price Shoes Benefits — Documento interno de presentación*
