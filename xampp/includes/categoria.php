<?php
// Plantilla de las páginas de categoría: recibe $slug (calzado, ropa, accesorios, ninos)
$cat = null;
$productos = [];
$falla = false;

// Busca la categoría y sus productos en la base de datos
try {
    $st = db()->prepare('SELECT id, nombre, descripcion FROM categorias WHERE slug = ?');
    $st->execute([$slug]);
    $cat = $st->fetch();
    if ($cat) {
        $st = db()->prepare('SELECT id, nombre, linea, descripcion, precio, imagen FROM productos WHERE categoria_id = ? ORDER BY id');
        $st->execute([$cat['id']]);
        $productos = $st->fetchAll();
    }
} catch (PDOException $ex) {
    $falla = true;
}

$titulo = $cat ? $cat['nombre'] : 'Categoría';
$activa = $slug . '.php';
require __DIR__ . '/header.php';
?>
  <!-- Título de la categoría -->
  <section class="titulo-cat">
    <div>
      <h1><?= e($cat ? $cat['nombre'] : 'Categoría') ?></h1>
      <p><?= e($cat ? $cat['descripcion'] : '') ?></p>
    </div>
  </section>

  <!-- Lista de productos -->
  <main class="contenedor">
    <?php if ($falla || !$cat): ?>
      <div class="alert" role="alert"><p>No se pudieron cargar los productos. Revisa que MySQL esté activo y que database.sql esté importado.</p></div>
    <?php else: ?>
      <ul class="productos">
        <?php foreach ($productos as $i => $p): ?>
          <li>
            <article class="card">
              <?php // Foto: solo se usa si es una dirección http(s) o una ruta local de la carpeta img/ ?>
              <?php $foto = trim((string) $p['imagen']); ?>
              <div class="card-img tono-<?= $i % 6 + 1 ?>">
                <span aria-hidden="true"><?= e($p['linea']) ?></span>
                <?php if (preg_match('#^(https?://|img/)#i', $foto)): ?>
                  <img src="<?= e($foto) ?>" alt="<?= e($p['nombre']) ?>" loading="lazy" onerror="this.remove()">
                <?php endif; ?>
              </div>
              <h3><?= e($p['nombre']) ?></h3>
              <p class="desc"><?= e($p['descripcion']) ?></p>
              <p class="precio"><?= dinero($p['precio']) ?></p>
              <!-- Agrega el producto al carrito (el campo oculto "volver" regresa a esta página) -->
              <form method="post" action="carrito.php">
                <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
                <input type="hidden" name="accion" value="agregar">
                <input type="hidden" name="id" value="<?= (int) $p['id'] ?>">
                <input type="hidden" name="volver" value="<?= e($slug) ?>.php">
                <button type="submit" class="btn-add">Agregar al carrito</button>
              </form>
            </article>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>
  </main>
<?php require __DIR__ . '/footer.php'; ?>
