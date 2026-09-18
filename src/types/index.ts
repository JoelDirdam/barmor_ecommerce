export type CategorySlug =
  | 'sombreros'
  | 'cachuchas'
  | 'camisas'
  | 'chivarras'
  | 'jeans'
  | 'botas'
  | 'accesorios'
  | 'ofertas'

export interface Category {
  slug: CategorySlug
  /** Etiqueta en español (mercado primario) */
  name: string
  nameEn: string
  /** Nombre del icono en `IconGlyph.vue` */
  icon: string
  /** Tono de la textura del placeholder */
  texture: TextureKind
  blurb: string
  blurbEn: string
}

export type TextureKind = 'palma' | 'leather' | 'denim' | 'cotton' | 'metal' | 'suede'

export type BadgeKind = 'handmade' | 'leather' | 'bestseller' | 'new' | 'sale'

export interface ProductVariant {
  /** Nombre comercial del color, se muestra como texto junto al swatch (§4.4) */
  name: string
  nameEn: string
  /** Color del swatch (piel curtida, lavado de mezclilla, etc.) */
  swatch: string
  /** Índice de imagen de la galería que corresponde a esta variante */
  image: number
}

export interface SizeOption {
  label: string
  inStock: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  nameEn: string
  category: CategorySlug
  /** Precio actual en MXN */
  price: number
  /** Precio de lista, si hay descuento */
  compareAt?: number
  rating: number
  reviews: number
  badges: BadgeKind[]
  /** Línea de meta: corte + material (§4.3) */
  fit: string
  fitEn: string
  material: string
  materialEn: string
  description: string
  descriptionEn: string
  care: string[]
  careEn: string[]
  variants: ProductVariant[]
  sizes: SizeOption[]
  /** Sistema de tallas para la guía de tallas */
  sizeSystem: 'alpha' | 'boot-mx' | 'hat' | 'waist' | 'unica'
  texture: TextureKind
  /**
   * Fotos reales. Vacío = se dibuja el placeholder de material.
   * Sube los archivos a `public/products/` y pon aquí las rutas
   * (p. ej. `['/products/sombrero-durango-1.jpg', ...]`).
   */
  images: string[]
  /** Producto destacado en el home */
  featured?: boolean
}

export interface CartLine {
  key: string
  productId: string
  size: string
  variant: string
  qty: number
}

export interface InstagramReel {
  id: string
  /** URL del reel o publicación. Cópiala desde Instagram → Compartir → Copiar enlace */
  url: string
  /** Portada local en `public/instagram/`. Vacío = placeholder tejido */
  thumbnail: string
  caption: string
  texture: TextureKind
  /** Etiqueta opcional: "Reel", "Nuevo", etc. */
  tag?: string
}

export type Locale = 'es' | 'en'
