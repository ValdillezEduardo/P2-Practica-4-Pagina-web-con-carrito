-- Crea la base de datos si no existe
CREATE DATABASE IF NOT EXISTS nike_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nike_db;

-- Tabla de usuarios registrados (se conserva al volver a importar este archivo)
CREATE TABLE IF NOT EXISTS usuarios (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- identificador único
  nombre          VARCHAR(60)  NOT NULL,
  apellido        VARCHAR(60)  NOT NULL,
  email           VARCHAR(120) NOT NULL UNIQUE,            -- no se puede repetir
  password_hash   VARCHAR(255) NOT NULL,                   -- contraseña cifrada
  fecha_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP      -- se llena sola
) ENGINE=InnoDB;

-- Pedidos de compra (también se conservan al volver a importar)
CREATE TABLE IF NOT EXISTS pedidos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,     -- folio del pedido
  usuario_id  INT UNSIGNED NOT NULL,
  total       DECIMAL(10,2) NOT NULL,
  fecha       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- Productos de cada pedido (guarda nombre y precio del momento de la compra)
CREATE TABLE IF NOT EXISTS pedido_items (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pedido_id    INT UNSIGNED NOT NULL,
  producto_id  INT UNSIGNED NOT NULL,                      -- sin llave foránea para poder renovar el catálogo
  nombre       VARCHAR(120) NOT NULL,
  precio       DECIMAL(10,2) NOT NULL,
  cantidad     INT UNSIGNED NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Se recrean las tablas del catálogo para reemplazar los productos anteriores
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;

-- Categorías de la tienda
CREATE TABLE categorias (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(60)  NOT NULL,
  slug         VARCHAR(40)  NOT NULL UNIQUE,   -- nombre usado en la página (calzado, ropa...)
  descripcion  VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Productos; cada uno pertenece a una categoría
CREATE TABLE productos (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categoria_id  INT UNSIGNED NOT NULL,
  nombre        VARCHAR(120) NOT NULL,
  linea         VARCHAR(60)  NOT NULL,         -- tipo de uso (Running, Lifestyle, Fútbol...)
  descripcion   VARCHAR(255) NOT NULL,
  precio        DECIMAL(10,2) NOT NULL,        -- en pesos mexicanos
  imagen        VARCHAR(500) NULL,             -- dirección (URL) o ruta de la foto
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB;

-- Alta de categorías
INSERT INTO categorias (nombre, slug, descripcion) VALUES
  ('Calzado', 'calzado', 'Tenis para correr, entrenar, jugar y para el día a día.'),
  ('Ropa', 'ropa', 'Playeras, sudaderas, pants y chamarras deportivas para todos los días.'),
  ('Accesorios', 'accesorios', 'Mochilas, gorras, balones y todo lo que necesitas para completar tu equipo.'),
  ('Niños', 'ninos', 'Calzado, ropa y accesorios Nike para los más pequeños.');

-- Alta de productos: Calzado
INSERT INTO productos (categoria_id, nombre, linea, descripcion, precio, imagen) VALUES
  ((SELECT id FROM categorias WHERE slug = 'calzado'), 'Nike Air Force 1 ''07', 'Lifestyle', 'El tenis clásico de piel con amortiguación Air.', 2399.00, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'calzado'), 'Nike Air Max 90', 'Lifestyle', 'Diseño icónico con unidad Air visible en el talón.', 3099.00, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'calzado'), 'Nike Pegasus 41', 'Running', 'Tenis de running para entrenar a diario con amortiguación reactiva.', 2899.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'calzado'), 'Nike Vomero 17', 'Running', 'Amortiguación suave para kilómetros largos y cómodos.', 3499.00, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'calzado'), 'Nike Dunk Low', 'Lifestyle', 'Silueta de básquetbol de los 80 convertida en básico urbano.', 2699.00, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'calzado'), 'Air Jordan 1 Low', 'Básquetbol', 'Versión baja del modelo que inició la línea Jordan.', 2799.00, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'calzado'), 'Nike Metcon 9', 'Entrenamiento', 'Estabilidad y durabilidad para levantar y entrenar.', 3199.00, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'calzado'), 'Nike Mercurial Vapor 15 Academy', 'Fútbol', 'Tacos ligeros para jugar en pasto natural y sintético.', 1899.00, 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'calzado'), 'Nike Court Vision Low', 'Lifestyle', 'Estilo retro de básquetbol con acabado de piel sintética.', 1599.00, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'calzado'), 'Nike Revolution 7', 'Running', 'Tenis ligero y flexible para empezar a correr.', 1299.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=70');

-- Alta de productos: Ropa
INSERT INTO productos (categoria_id, nombre, linea, descripcion, precio, imagen) VALUES
  ((SELECT id FROM categorias WHERE slug = 'ropa'), 'Playera Nike Sportswear Club', 'Sportswear', 'Playera de algodón con corte clásico y logo Swoosh.', 549.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ropa'), 'Playera Nike Dri-FIT Legend', 'Entrenamiento', 'Tecnología Dri-FIT que mantiene la piel seca al entrenar.', 599.00, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ropa'), 'Sudadera con Capucha Nike Club Fleece', 'Sportswear', 'Felpa suave por dentro con bolsillo frontal.', 1299.00, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ropa'), 'Pants Nike Tech Fleece', 'Sportswear', 'Pants ligeros de corte entallado y tela de calidez moderada.', 2299.00, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ropa'), 'Short Nike Dri-FIT Challenger', 'Running', 'Short de running ligero con forro interior.', 699.00, 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ropa'), 'Chamarra Nike Windrunner', 'Running', 'Chamarra rompevientos con capucha y diseño clásico.', 1899.00, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ropa'), 'Leggings Nike One', 'Entrenamiento', 'Leggings de cintura alta cómodos para entrenar.', 899.00, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ropa'), 'Top Deportivo Nike Swoosh', 'Entrenamiento', 'Top de soporte medio para entrenamientos de impacto moderado.', 799.00, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ropa'), 'Playera de Fútbol Nike Dri-FIT Academy', 'Fútbol', 'Playera transpirable para entrenar y jugar.', 749.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ropa'), 'Pants Nike Club Jogger', 'Sportswear', 'Pants con puños elásticos y bolsillos laterales.', 999.00, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=70');

-- Alta de productos: Accesorios
INSERT INTO productos (categoria_id, nombre, linea, descripcion, precio, imagen) VALUES
  ((SELECT id FROM categorias WHERE slug = 'accesorios'), 'Mochila Nike Brasilia 9.5', 'Mochilas', 'Mochila resistente con compartimento principal amplio.', 799.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'accesorios'), 'Mochila Nike Elemental', 'Mochilas', 'Mochila de uso diario con bolsillo frontal.', 899.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'accesorios'), 'Gorra Nike Club Swoosh', 'Gorras', 'Gorra ajustable de algodón con logo bordado.', 449.00, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'accesorios'), 'Calcetas Nike Everyday Cushioned (3 pares)', 'Calcetas', 'Calcetas acolchadas para entrenar y correr.', 399.00, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'accesorios'), 'Balón de Fútbol Nike Pitch', 'Balones', 'Balón duradero para jugar en cancha o parque.', 599.00, 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'accesorios'), 'Balón de Básquetbol Nike Everyday Playground', 'Balones', 'Balón para cancha exterior con buen agarre.', 699.00, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'accesorios'), 'Botella Nike Big Mouth', 'Hidratación', 'Botella de boca ancha fácil de llenar y limpiar.', 449.00, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'accesorios'), 'Riñonera Nike Heritage', 'Bolsas', 'Riñonera compacta para llevar lo esencial.', 599.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'accesorios'), 'Muñequeras Nike Swoosh (2 piezas)', 'Entrenamiento', 'Muñequeras absorbentes para entrenar.', 299.00, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'accesorios'), 'Bolsa de Gimnasio Nike Gym Club', 'Bolsas', 'Bolsa de mano espaciosa para ir al gimnasio.', 999.00, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=70');

-- Alta de productos: Niños
INSERT INTO productos (categoria_id, nombre, linea, descripcion, precio, imagen) VALUES
  ((SELECT id FROM categorias WHERE slug = 'ninos'), 'Nike Air Force 1 Niños', 'Calzado', 'El clásico de piel en tallas para niños.', 1799.00, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ninos'), 'Nike Revolution 7 Niños', 'Calzado', 'Tenis ligero y cómodo para correr y jugar.', 999.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ninos'), 'Nike Dunk Low Niños', 'Calzado', 'Silueta clásica en tallas para niños.', 1799.00, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ninos'), 'Playera Nike Sportswear Niños', 'Ropa', 'Playera de algodón suave para todos los días.', 399.00, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ninos'), 'Sudadera Nike Club Fleece Niños', 'Ropa', 'Sudadera de felpa suave y corte cómodo.', 899.00, 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ninos'), 'Pants Nike Sportswear Niños', 'Ropa', 'Pants cómodos con cintura elástica.', 799.00, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ninos'), 'Short Nike Dri-FIT Niños', 'Ropa', 'Short ligero para deporte y juego.', 449.00, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ninos'), 'Mochila Nike Classic Niños', 'Accesorios', 'Mochila escolar con correas acolchadas.', 599.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ninos'), 'Chamarra Nike Windrunner Niños', 'Ropa', 'Chamarra rompevientos ligera con capucha.', 1199.00, 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=70'),
  ((SELECT id FROM categorias WHERE slug = 'ninos'), 'Nike Jr. Mercurial Vapor 15 Club', 'Calzado', 'Tacos de fútbol para niños con ajuste cómodo.', 1299.00, 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=70');
