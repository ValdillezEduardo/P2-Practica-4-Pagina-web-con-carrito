  <!-- Pie de página con los datos del alumno (se editan en config.php) -->
  <footer class="pie">
    <div>
      <h2>Datos del alumno</h2>
      <?php foreach ($alumno as $campo => $valor): ?>
        <p><strong><?= e($campo) ?>:</strong> <?= e($valor) ?></p>
      <?php endforeach; ?>
      <p class="copy">&copy; 2026 Tienda deportiva. Todos los derechos reservados.</p>
    </div>
  </footer>
  <!-- Cierra el menú de cuenta al hacer clic fuera de él -->
  <script>
    document.addEventListener('click', function (ev) {
      document.querySelectorAll('.cuenta-menu[open]').forEach(function (d) {
        if (!d.contains(ev.target)) d.removeAttribute('open');
      });
    });
  </script>
</body>
</html>
