require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configura la conexión a la base de datos
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Datos ficticios
const dummyData = [
  {
    "descripcion": "Producto A",
    "cantidad": 20,
    "precio_compra": 29.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 1",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto A",
    "cantidad": 15,
    "precio_compra": 29.99,
    "fecha_compra": "2023-07-02",
    "sucursal": "Sucursal 1",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto B",
    "cantidad": 25,
    "precio_compra": 49.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 2",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto B",
    "cantidad": 35,
    "precio_compra": 49.99,
    "fecha_compra": "2023-07-03",
    "sucursal": "Sucursal 2",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto C",
    "cantidad": 10,
    "precio_compra": 19.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 1",
    "tipo_movimiento": "salida"
  },
  {
    "descripcion": "Producto C",
    "cantidad": 25,
    "precio_compra": 19.99,
    "fecha_compra": "2023-07-02",
    "sucursal": "Sucursal 1",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto D",
    "cantidad": 20,
    "precio_compra": 39.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 3",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto D",
    "cantidad": 30,
    "precio_compra": 39.99,
    "fecha_compra": "2023-07-03",
    "sucursal": "Sucursal 3",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto E",
    "cantidad": 30,
    "precio_compra": 59.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 2",
    "tipo_movimiento": "salida"
  },
  {
    "descripcion": "Producto E",
    "cantidad": 40,
    "precio_compra": 59.99,
    "fecha_compra": "2023-07-02",
    "sucursal": "Sucursal 2",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto F",
    "cantidad": 25,
    "precio_compra": 9.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 1",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto F",
    "cantidad": 20,
    "precio_compra": 9.99,
    "fecha_compra": "2023-07-03",
    "sucursal": "Sucursal 1",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto G",
    "cantidad": 15,
    "precio_compra": 24.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 3",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto G",
    "cantidad": 10,
    "precio_compra": 24.99,
    "fecha_compra": "2023-07-03",
    "sucursal": "Sucursal 3",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto H",
    "cantidad": 20,
    "precio_compra": 14.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 2",
    "tipo_movimiento": "salida"
  },
  {
    "descripcion": "Producto H",
    "cantidad": 15,
    "precio_compra": 14.99,
    "fecha_compra": "2023-07-02",
    "sucursal": "Sucursal 2",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto I",
    "cantidad": 20,
    "precio_compra": 39.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 1",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto I",
    "cantidad": 25,
    "precio_compra": 39.99,
    "fecha_compra": "2023-07-03",
    "sucursal": "Sucursal 1",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto J",
    "cantidad": 20,
    "precio_compra": 49.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 3",
    "tipo_movimiento": "salida"
  },
  {
    "descripcion": "Producto J",
    "cantidad": 30,
    "precio_compra": 49.99,
    "fecha_compra": "2023-07-02",
    "sucursal": "Sucursal 3",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto K",
    "cantidad": 30,
    "precio_compra": 59.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 2",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto K",
    "cantidad": 25,
    "precio_compra": 59.99,
    "fecha_compra": "2023-07-03",
    "sucursal": "Sucursal 2",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto L",
    "cantidad": 30,
    "precio_compra": 69.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 1",
    "tipo_movimiento": "salida"
  },
  {
    "descripcion": "Producto L",
    "cantidad": 40,
    "precio_compra": 69.99,
    "fecha_compra": "2023-07-02",
    "sucursal": "Sucursal 1",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto M",
    "cantidad": 20,
    "precio_compra": 79.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 3",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto M",
    "cantidad": 25,
    "precio_compra": 79.99,
    "fecha_compra": "2023-07-03",
    "sucursal": "Sucursal 3",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto N",
    "cantidad": 15,
    "precio_compra": 89.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 2",
    "tipo_movimiento": "salida"
  },
  {
    "descripcion": "Producto N",
    "cantidad": 20,
    "precio_compra": 89.99,
    "fecha_compra": "2023-07-03",
    "sucursal": "Sucursal 2",
    "tipo_movimiento": "entrada"
  },
  {
    "descripcion": "Producto O",
    "cantidad": 25,
    "precio_compra": 99.99,
    "fecha_compra": "2023-07-01",
    "sucursal": "Sucursal 1",
    "tipo_movimiento": "entrada"
  }
];

// Endpoint para agregar un nuevo producto al inventario
app.post('/api/inventario', async (req, res) => {
  const { descripcion, cantidad, precio_compra, fecha_compra, sucursal, tipo_movimiento } = req.body;

  try {
    const [result] = await db.execute(
      'INSERT INTO producto (descripcion, cantidad, precio_compra, fecha_compra, sucursal, tipo_movimiento) VALUES (?, ?, ?, ?, ?, ?)',
      [descripcion, cantidad, precio_compra, fecha_compra, sucursal, tipo_movimiento]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error al insertar datos en la tabla producto:', error);
    res.status(500).json({ error: 'Error al insertar datos en la tabla producto' });
  }
});

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('API de Inventario');
});

// Endpoint para obtener datos ficticios
app.get('/api/mock-data', (req, res) => {
  res.json(dummyData);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
