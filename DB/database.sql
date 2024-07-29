CREATE DATABASE inventario;

USE inventario;

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL,
  cantidad_en_stock INT NOT NULL,
  precio_compra DECIMAL(10, 2) NOT NULL,
  fecha_vencimiento DATE,
);