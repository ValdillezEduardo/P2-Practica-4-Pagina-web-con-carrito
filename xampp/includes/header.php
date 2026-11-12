<?php
// Cabecera común: usa $titulo (título de la pestaña) y $activa (archivo de la página actual)
$menu = [
    'index.php'      => 'Inicio',
    'calzado.php'    => 'Calzado',
    'ropa.php'       => 'Ropa',
    'accesorios.php' => 'Accesorios',
    'ninos.php'      => 'Niños',
];
// Número de productos que hay en el carrito
$enCarrito = array_sum($_SESSION['carrito'] ?? []);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($titulo) ?></title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <!-- Barra superior: marca, menú de categorías, carrito y cuenta -->
  <header class="topbar">
    <strong class="brand">NIKE</strong>
    <nav class="menu" aria-label="Categorías">
      <?php foreach ($menu as $archivo => $texto): ?>
        <a href="<?= $archivo ?>"<?= $archivo === $activa ? ' aria-current="page"' : '' ?>><?= e($texto) ?></a>
      <?php endforeach; ?>
    </nav>
    <div class="cuenta">
      <a href="carrito.php"<?= $activa === 'carrito.php' ? ' aria-current="page"' : '' ?>>Carrito (<?= (int) $enCarrito ?>)</a>
      <!-- Botón Cuenta: despliega registro e inicio de sesión (o la cuenta, si ya hay sesión) -->
      <details class="cuenta-menu">
        <summary>Cuenta</summary>
        <div class="cuenta-panel">
          <?php if (isset($_SESSION['usuario_id'])): ?>
            <span>Hola, <?= e($_SESSION['nombre']) ?></span>
            <a href="logout.php">Cerrar sesión</a>
          <?php else: ?>
            <a href="login.php">Iniciar sesión</a>
            <a href="register.php">Crear cuenta</a>
          <?php endif; ?>
        </div>
      </details>
    </div>
  </header>
  <!-- Mensaje temporal (producto agregado, compra realizada, errores) -->
  <?php if (!empty($_SESSION['flash'])): ?>
    <div class="aviso aviso-<?= e($_SESSION['flash'][0]) ?>" role="status"><?= e($_SESSION['flash'][1]) ?></div>
    <?php unset($_SESSION['flash']); ?>
  <?php endif; ?>
