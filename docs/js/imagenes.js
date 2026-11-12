// Direcciones (URL) de las fotos de los productos.
// Si una dirección queda vacía o no carga, se muestra el bloque de color.
// Puede ser una URL (https://...) o una ruta local (img/calzado/air-force-1.jpg).
const IMAGENES = {
  // Calzado
  "Nike Air Force 1 '07": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=70",
  "Nike Air Max 90": "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=70",
  "Nike Pegasus 41": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=70",
  "Nike Vomero 17": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=70",
  "Nike Dunk Low": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=70",
  "Air Jordan 1 Low": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=70",
  "Nike Metcon 9": "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=70",
  "Nike Mercurial Vapor 15 Academy": "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=70",
  "Nike Court Vision Low": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=70",
  "Nike Revolution 7": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=70",
  // Ropa
  "Playera Nike Sportswear Club": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=70",
  "Playera Nike Dri-FIT Legend": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=70",
  "Sudadera con Capucha Nike Club Fleece": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=70",
  "Pants Nike Tech Fleece": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=70",
  "Short Nike Dri-FIT Challenger": "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=600&q=70",
  "Chamarra Nike Windrunner": "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=70",
  "Leggings Nike One": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=70",
  "Top Deportivo Nike Swoosh": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=70",
  "Playera de Fútbol Nike Dri-FIT Academy": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=70",
  "Pants Nike Club Jogger": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=70",
  // Accesorios
  "Mochila Nike Brasilia 9.5": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=70",
  "Mochila Nike Elemental": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=70",
  "Gorra Nike Club Swoosh": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=70",
  "Calcetas Nike Everyday Cushioned (3 pares)": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=70",
  "Balón de Fútbol Nike Pitch": "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=70",
  "Balón de Básquetbol Nike Everyday Playground": "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=70",
  "Botella Nike Big Mouth": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=70",
  "Riñonera Nike Heritage": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=70",
  "Muñequeras Nike Swoosh (2 piezas)": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=70",
  "Bolsa de Gimnasio Nike Gym Club": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=70",
  // Niños
  "Nike Air Force 1 Niños": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=70",
  "Nike Revolution 7 Niños": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=70",
  "Nike Dunk Low Niños": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=70",
  "Playera Nike Sportswear Niños": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=70",
  "Sudadera Nike Club Fleece Niños": "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=70",
  "Pants Nike Sportswear Niños": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=70",
  "Short Nike Dri-FIT Niños": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=70",
  "Mochila Nike Classic Niños": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=70",
  "Chamarra Nike Windrunner Niños": "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=70",
  "Nike Jr. Mercurial Vapor 15 Club": "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=70",
};
