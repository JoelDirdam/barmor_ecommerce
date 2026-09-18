import type { InstagramReel } from '@/types'

/**
 * Carrusel de Instagram — datos locales (§ elegido en el brief)
 * -----------------------------------------------------------------------
 * Instagram no permite leer los reels de una cuenta sin la Graph API y un
 * token de cuenta Business, así que el carrusel se alimenta de esta lista.
 *
 * Para publicar contenido real:
 *   1. Abre el reel en Instagram → botón Compartir → "Copiar enlace".
 *   2. Pega ese enlace en `url`.
 *   3. Guarda una portada (screenshot del primer cuadro, recorte 4:5 o 9:16)
 *      en `public/instagram/` y pon la ruta en `thumbnail`
 *      (p. ej. `/instagram/reel-01.jpg`). Si lo dejas vacío se dibuja un
 *      placeholder tejido, no se rompe el layout.
 *
 * Cuando el dueño autorice su cuenta Business, este archivo se reemplaza por
 * una llamada a `/api/instagram` sin tocar el componente: el carrusel sólo
 * espera un arreglo de `InstagramReel`.
 */

export const INSTAGRAM_HANDLE = 'barmor_estilo_ranch_vaquera_'
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`
export const INSTAGRAM_REELS_URL = `${INSTAGRAM_URL}reels/`

export const instagramReels: InstagramReel[] = [
  {
    id: 'ig-1',
    url: INSTAGRAM_REELS_URL,
    thumbnail: '',
    caption: 'Sombreros de palma recién entrados a la tienda',
    texture: 'palma',
    tag: 'Reel',
  },
  {
    id: 'ig-2',
    url: INSTAGRAM_REELS_URL,
    thumbnail: '',
    caption: 'Cómo se arma una chivarra de vaqueta',
    texture: 'suede',
    tag: 'Reel',
  },
  {
    id: 'ig-3',
    url: INSTAGRAM_REELS_URL,
    thumbnail: '',
    caption: 'Botas puntal: horma, suela y costura',
    texture: 'leather',
    tag: 'Reel',
  },
  {
    id: 'ig-4',
    url: INSTAGRAM_REELS_URL,
    thumbnail: '',
    caption: 'Camisas con yugo vaquero, nuevos colores',
    texture: 'cotton',
    tag: 'Reel',
  },
  {
    id: 'ig-5',
    url: INSTAGRAM_REELS_URL,
    thumbnail: '',
    caption: 'Cintos piteados hechos a mano en Durango',
    texture: 'metal',
    tag: 'Reel',
  },
  {
    id: 'ig-6',
    url: INSTAGRAM_REELS_URL,
    thumbnail: '',
    caption: 'Mezclilla rígida de 13 oz, corte bota',
    texture: 'denim',
    tag: 'Reel',
  },
]
