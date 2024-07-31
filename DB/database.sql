CREATE TABLE producto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL,
  cantidad INT NOT NULL,
  precio_compra DECIMAL(10, 2) NOT NULL,
  fecha_compra DATE NOT NULL,
  sucursal VARCHAR(255) NOT NULL,
  tipo_movimiento ENUM('entrada', 'salida') NOT NULL,
  fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);