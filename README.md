# Barmor — Plantilla E-commerce

Plantilla de tienda en línea para **Barmor · Estilo Ranch Vaquera** (Durango, México),
construida a partir de `DESIGN.md` (sistema de diseño "Rancho moderno").

Es **solo el front-end**: no hay backend, base de datos ni pasarela de pago. El catálogo
vive en archivos TypeScript y el carrito en `localStorage`. Está pensada para mostrársela
al dueño y, si aprueba, seguir con el desarrollo real.

## Stack

| Pieza | Versión |
|---|---|
| Vue 3 (`<script setup>`, TypeScript) | ^3.5 |
| Vite | ^7 |
| Tailwind CSS (config CSS-first con `@theme`) | ^4.1 |
| Vue Router | ^4.5 |
| Pinia | ^3 |
| vue-i18n (ES / EN) | ^11 |

Cero dependencias de UI: iconos, texturas y componentes son propios.

## Correr en local

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build a dist/
npm run preview    # sirve dist/ en el puerto PORT o 4173
```

## Qué incluye

**Páginas** (`src/views/`)

- `/` — hero full-bleed, categorías, destacados, franja de valores, **carrusel de Instagram**, novedades, ofertas.
- `/catalogo/:categoria?` — chips de categoría, filtros (precio, existencia, orden) en barra lateral en desktop y hoja inferior en móvil, retícula 2 → 3 → 4 → 5 columnas, skeletons.
- `/producto/:slug` — galería deslizable (móvil) / retícula (desktop), selector de talla con agotadas tachadas, swatches de color con nombre, acordeones, guía de tallas, barra de compra fija en móvil, "completa el atuendo".
- `/carrito`, `/pagar` — checkout de una página en acordeón (Contacto → Envío → Pago), invitado por defecto, métodos de pago del mercado MX (tarjeta, OXXO, SPEI, billeteras).
- `/nosotros`, y 404.

**Del DESIGN.md**

- Tokens de color, tipografía (Fraunces + Inter) y breakpoints (600 / 900 / 1280) en `src/assets/main.css`.
- Modo oscuro por variable, no por clases duplicadas. El ámbar nunca lleva texto blanco (§6): existe el token `--color-on-accent`.
- Objetivos táctiles de 44 px, `aria-live` al agregar al carrito, tallas agotadas con `aria-disabled`, focus ring ámbar, `prefers-reduced-motion` respetado, carrusel sin autoplay.
- Toggle MXN/USD e idioma ES/EN.

## Carrusel de Instagram

El perfil es [@barmor_estilo_ranch_vaquera_](https://www.instagram.com/barmor_estilo_ranch_vaquera_/reels/).
Instagram **no permite leer los reels de una cuenta sin la Graph API** y un token de cuenta
Business, así que el carrusel se alimenta de `src/data/instagram.ts`.

Para poner contenido real:

1. Abre el reel en Instagram → **Compartir → Copiar enlace** y pégalo en `url`.
2. Guarda una portada (captura del primer cuadro, recorte 9:16) en `public/instagram/`
   y pon la ruta en `thumbnail`, p. ej. `/instagram/reel-01.jpg`.
3. Ajusta `caption`. Si `thumbnail` queda vacío se dibuja un placeholder tejido: no se rompe nada.

Cuando el dueño autorice su cuenta Business, se reemplaza ese archivo por una llamada a la
Graph API (`/me/media?fields=permalink,thumbnail_url,caption,media_type`) sin tocar el
componente: `InstagramReelsCarousel.vue` sólo espera un arreglo de `InstagramReel`.

## Fotografía

Todavía no hay fotos, así que cada producto dibuja un **placeholder de material en SVG**
(grano de piel, tejido de palma, sarga de mezclilla) en lugar de un rectángulo gris.

Para cargar fotos reales: súbelas a `public/products/` y lista las rutas en el campo
`images` del producto en `src/data/products.ts`:

```ts
images: ['/products/botas-cuenca-1.jpg', '/products/botas-cuenca-2.jpg'],
```

Formato recomendado: 4:5, 1200×1500 px, WebP. En cuanto `images` tiene contenido, el
placeholder desaparece.

## Editar el catálogo

| Archivo | Qué controla |
|---|---|
| `src/data/products.ts` | Productos, precios, tallas, colores, descripciones, cuidados |
| `src/data/categories.ts` | Las 8 categorías del menú y del home |
| `src/data/instagram.ts` | Reels del carrusel y handle de la cuenta |
| `src/i18n/es.ts` / `en.ts` | Todos los textos de la interfaz |
| `src/assets/main.css` | Colores, tipografías, radios, breakpoints |
| `src/stores/cart.ts` | Umbral de envío gratis (`FREE_SHIPPING_THRESHOLD`) y costo de envío |
| `src/composables/useFormat.ts` | Tipo de cambio de referencia MXN → USD |

Los textos en español y en inglés van en pares: cada producto tiene `name`/`nameEn`,
`description`/`descriptionEn`, etc. Si falta el inglés, cae al español automáticamente.

## Desplegar en Railway

El repo trae `Dockerfile` (build de Node + nginx sirviendo `dist/` con fallback SPA) y
`nginx.conf`, que lee el `PORT` que inyecta Railway. Railway detecta el Dockerfile solo:
no hace falta configurar comandos de build.

Si prefieres Nixpacks en lugar de Docker, borra el `Dockerfile` y deja que Railway use
`npm run build` + `npm run preview` (el script ya escucha en `0.0.0.0` y respeta `PORT`).

No hay variables de entorno obligatorias.

## Lo que falta para que sea una tienda de verdad

1. Backend con catálogo, inventario y órdenes (el diseño ya separa datos de vista).
2. Pasarela de pago (Stripe / Mercado Pago / Conekta para OXXO y SPEI).
3. Cotización de envío real y seguimiento de guía.
4. Cuentas de cliente e historial de pedidos.
5. Fotografía de producto y los reels reales del perfil.
6. SEO (meta por producto, sitemap, datos estructurados) y analítica.
