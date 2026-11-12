<?php
// Página de inicio: presentación e información del sitio
require 'config.php';
$titulo = 'Inicio';
$activa = 'index.php';
require 'includes/header.php';
?>
  <!-- Presentación principal -->
  <section class="hero">
    <div class="hero-inner">
      <h1>Equípate<br>para moverte.</h1>
      <p>Calzado, ropa y accesorios deportivos Nike para hombre, mujer y niños, en un solo lugar.</p>
      <a class="btn" href="calzado.php">Ver calzado</a>
    </div>
  </section>
  <main>
    <!-- Información del sitio -->
    <section class="contenedor intro">
      <h2>Sobre la tienda</h2>
      <p>Somos una tienda deportiva en línea con lo mejor de Nike para correr, entrenar, jugar y vestir todos los días. Nuestro catálogo está organizado por categorías para que encuentres rápido lo que buscas.</p>
      <p>Agrega tus productos favoritos al carrito y crea tu cuenta para finalizar tu compra.</p>
    </section>
    <!-- Categorías disponibles -->
    <section class="contenedor">
      <h2>Categorías</h2>
      <div class="cats">
        <a class="cat" href="calzado.php">
          <strong>Calzado</strong>
          <span>Ver 10 productos</span>
        </a>
        <a class="cat" href="ropa.php">
          <strong>Ropa</strong>
          <span>Ver 10 productos</span>
        </a>
        <a class="cat" href="accesorios.php">
          <strong>Accesorios</strong>
          <span>Ver 10 productos</span>
        </a>
        <a class="cat" href="ninos.php">
          <strong>Niños</strong>
          <span>Ver 10 productos</span>
        </a>
      </div>
    </section>
    <!-- Ventajas de la tienda -->
    <section class="contenedor">
      <h2>¿Por qué elegirnos?</h2>
      <div class="razones">
        <div><h3>Para todos los deportes</h3><p>Running, fútbol, básquetbol, entrenamiento y estilo de calle.</p></div>
        <div><h3>Catálogo ordenado</h3><p>Cada categoría tiene su propia sección para comparar con calma.</p></div>
        <div><h3>Carrito y cuenta</h3><p>Guarda tus productos en el carrito y finaliza tu compra con tu cuenta.</p></div>
      </div>
    </section>
  </main>
<?php require 'includes/footer.php'; ?>
