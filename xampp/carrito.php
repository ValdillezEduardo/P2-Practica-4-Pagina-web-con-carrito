<?php
// Carrito de compras: se guarda en la sesión y los productos se leen de la base de datos
require 'config.php';

// Páginas a las que se puede volver después de agregar un producto
$permitidas = ['index.php', 'calzado.php', 'ropa.php', 'accesorios.php', 'ninos.php', 'carrito.php'];

// El carrito es un arreglo [id_producto => cantidad]
$carrito = $_SESSION['carrito'] ?? [];

// Acciones del carrito (se ejecutan al enviar un formulario)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $destino = in_array($_POST['volver'] ?? '', $permitidas, true) ? $_POST['volver'] : 'carrito.php';
    $accion = $_POST['accion'] ?? '';
    $id = (int) ($_POST['id'] ?? 0);

    if (!csrf_valido()) {
        $_SESSION['flash'] = ['error', 'La sesión expiró. Inténtalo de nuevo.'];

    } elseif ($accion === 'agregar') {
        // Solo se agregan productos que existen en la base de datos
        try {
            $st = db()->prepare('SELECT id, nombre FROM productos WHERE id = ?');
            $st->execute([$id]);
            $prod = $st->fetch();
            if ($prod) {
                $carrito[$id] = min(10, ($carrito[$id] ?? 0) + 1);
                $_SESSION['flash'] = ['ok', $prod['nombre'] . ' se agregó al carrito.'];
            } else {
                $_SESSION['flash'] = ['error', 'El producto no existe.'];
            }
        } catch (PDOException $ex) {
            $_SESSION['flash'] = ['error', 'No se pudo conectar con la base de datos.'];
        }

    } elseif ($accion === 'mas' && isset($carrito[$id])) {
        // Una pieza más (máximo 10)
        $carrito[$id] = min(10, $carrito[$id] + 1);

    } elseif ($accion === 'menos' && isset($carrito[$id])) {
        // Una pieza menos; si llega a cero se quita el producto
        $carrito[$id]--;
        if ($carrito[$id] <= 0) unset($carrito[$id]);

    } elseif ($accion === 'quitar') {
        unset($carrito[$id]);

    } elseif ($accion === 'vaciar') {
        $carrito = [];

    } elseif ($accion === 'finalizar') {
        if (!isset($_SESSION['usuario_id'])) {
            // Para comprar hace falta iniciar sesión
            $destino = 'login.php?next=carrito.php';
        } elseif (!$carrito) {
            $_SESSION['flash'] = ['error', 'Tu carrito está vacío.'];
        } else {
            $pdo = null;
            try {
                $pdo = db();
                // Lee los precios actuales de la base de datos (no los del navegador)
                $marcas = implode(',', array_fill(0, count($carrito), '?'));
                $st = $pdo->prepare("SELECT id, nombre, precio FROM productos WHERE id IN ($marcas)");
                $st->execute(array_keys($carrito));
                $filas = $st->fetchAll();

                if (!$filas) {
                    $carrito = [];
                    $_SESSION['flash'] = ['error', 'Los productos del carrito ya no están disponibles.'];
                } else {
                    $total = 0;
                    foreach ($filas as $f) {
                        $total += $f['precio'] * $carrito[$f['id']];
                    }

                    // Guarda el pedido y sus productos en una sola operación
                    $pdo->beginTransaction();
                    $st = $pdo->prepare('INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)');
                    $st->execute([$_SESSION['usuario_id'], round($total, 2)]);
                    $pedido = (int) $pdo->lastInsertId();

                    $st = $pdo->prepare('INSERT INTO pedido_items (pedido_id, producto_id, nombre, precio, cantidad) VALUES (?, ?, ?, ?, ?)');
                    foreach ($filas as $f) {
                        $st->execute([$pedido, $f['id'], $f['nombre'], $f['precio'], $carrito[$f['id']]]);
                    }
                    $pdo->commit();

                    $carrito = [];
                    $_SESSION['flash'] = ['ok', 'Compra realizada. Folio #' . $pedido . ' por ' . dinero($total) . '.'];
                }
            } catch (PDOException $ex) {
                if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
                $_SESSION['flash'] = ['error', 'No se pudo registrar la compra. Inténtalo de nuevo.'];
            }
        }
    }

    // Guarda el carrito y regresa a la página de origen
    $_SESSION['carrito'] = $carrito;
    header('Location: ' . $destino);
    exit;
}

// Lee de la base de datos los productos que hay en el carrito
$items = [];
$total = 0;
$falla = false;
if ($carrito) {
    try {
        $marcas = implode(',', array_fill(0, count($carrito), '?'));
        $st = db()->prepare("SELECT id, nombre, linea, precio, imagen FROM productos WHERE id IN ($marcas) ORDER BY id");
        $st->execute(array_keys($carrito));
        foreach ($st->fetchAll() as $f) {
            $f['cantidad'] = $carrito[$f['id']];
            $f['subtotal'] = $f['precio'] * $f['cantidad'];
            $total += $f['subtotal'];
            $items[] = $f;
        }
        // Quita del carrito los productos que ya no existen
        $_SESSION['carrito'] = [];
        foreach ($items as $it) {
            $_SESSION['carrito'][(int) $it['id']] = $it['cantidad'];
        }
    } catch (PDOException $ex) {
        $falla = true;
    }
}

$titulo = 'Carrito';
$activa = 'carrito.php';
require 'includes/header.php';

// Formulario pequeño para una acción sobre un producto (más, menos, quitar)
function boton_accion(string $accion, int $id, string $texto, string $etiqueta, string $clase = ''): void {
    echo '<form method="post" action="carrito.php">'
       . '<input type="hidden" name="csrf" value="' . e(csrf_token()) . '">'
       . '<input type="hidden" name="accion" value="' . e($accion) . '">'
       . '<input type="hidden" name="id" value="' . $id . '">'
       . '<button type="submit" class="' . e($clase) . '" aria-label="' . e($etiqueta) . '">' . $texto . '</button>'
       . '</form>';
}
?>
  <!-- Título de la página -->
  <section class="titulo-cat">
    <div>
      <h1>Carrito</h1>
      <p>Revisa tus productos antes de finalizar la compra.</p>
    </div>
  </section>

  <!-- Contenido del carrito -->
  <main class="contenedor">
    <?php if ($falla): ?>
      <div class="alert" role="alert"><p>No se pudo cargar el carrito. Revisa que MySQL esté activo.</p></div>
    <?php elseif (!$items): ?>
      <div class="vacio">
        <p>Tu carrito está vacío.</p>
        <a class="btn" href="calzado.php">Ver productos</a>
      </div>
    <?php else: ?>
      <div class="carrito">
        <!-- Lista de productos -->
        <ul class="lista-carrito">
          <?php foreach ($items as $it): ?>
            <?php $foto = trim((string) $it['imagen']); ?>
            <li class="item">
              <div class="item-img tono-<?= (int) $it['id'] % 6 + 1 ?>">
                <?php if (preg_match('#^(https?://|img/)#i', $foto)): ?>
                  <img src="<?= e($foto) ?>" alt="<?= e($it['nombre']) ?>" onerror="this.remove()">
                <?php endif; ?>
              </div>
              <div>
                <h3><?= e($it['nombre']) ?></h3>
                <p class="linea"><?= e($it['linea']) ?> &middot; <?= dinero($it['precio']) ?></p>
                <div class="cantidad">
                  <?php boton_accion('menos', (int) $it['id'], '&minus;', 'Quitar una pieza'); ?>
                  <span><?= (int) $it['cantidad'] ?></span>
                  <?php boton_accion('mas', (int) $it['id'], '+', 'Agregar una pieza'); ?>
                </div>
              </div>
              <div class="item-precio">
                <?= dinero($it['subtotal']) ?>
                <?php boton_accion('quitar', (int) $it['id'], 'Quitar', 'Quitar el producto', 'quitar'); ?>
              </div>
            </li>
          <?php endforeach; ?>
        </ul>

        <!-- Resumen y botones de compra -->
        <aside class="resumen">
          <h2>Resumen</h2>
          <div class="total"><span>Total</span><span><?= dinero($total) ?></span></div>
          <form method="post" action="carrito.php">
            <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
            <input type="hidden" name="accion" value="finalizar">
            <button type="submit" class="btn-add">Finalizar compra</button>
          </form>
          <form method="post" action="carrito.php">
            <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
            <input type="hidden" name="accion" value="vaciar">
            <button type="submit" class="btn-add btn-sec">Vaciar carrito</button>
          </form>
          <?php if (!isset($_SESSION['usuario_id'])): ?>
            <p class="nota">Necesitas iniciar sesión para finalizar tu compra.</p>
          <?php endif; ?>
        </aside>
      </div>
    <?php endif; ?>
  </main>
<?php require 'includes/footer.php'; ?>
