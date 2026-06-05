-- Esquema inicial para Cashfood
-- Base de datos: cashfood_db

CREATE DATABASE IF NOT EXISTS `cashfood_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cashfood_db`;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE,
  `contrasena_hash` VARCHAR(255),
  `rol` ENUM('cliente','admin') DEFAULT 'cliente',
  `creado_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(200) NOT NULL,
  `descripcion` TEXT,
  `precio` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `imagen` VARCHAR(255),
  `disponible` BOOLEAN DEFAULT TRUE,
  `categoria` VARCHAR(100),
  `creado_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de pedidos (ordenes)
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT,
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `estado` ENUM('pendiente','pagado','en_preparacion','entregado','cancelado') DEFAULT 'pendiente',
  `metodo_pago` VARCHAR(50),
  `creado_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Items por pedido
CREATE TABLE IF NOT EXISTS `pedido_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pedido_id` INT NOT NULL,
  `producto_id` INT NOT NULL,
  `cantidad` INT NOT NULL DEFAULT 1,
  `precio_unit` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Carrito persistente básico (por usuario o sesión)
CREATE TABLE IF NOT EXISTS `carrito` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT,
  `session_id` VARCHAR(255),
  `creado_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `carrito_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `carrito_id` INT NOT NULL,
  `producto_id` INT NOT NULL,
  `cantidad` INT NOT NULL DEFAULT 1,
  `precio_unit` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`carrito_id`) REFERENCES `carrito`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Índices sugeridos
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON `productos` (`categoria`);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON `pedidos` (`usuario_id`);
CREATE INDEX IF NOT EXISTS idx_carrito_usuario ON `carrito` (`usuario_id`);

-- Fin del esquema inicial
