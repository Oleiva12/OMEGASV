const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'tu_base_de_datos'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos establecida.');
  }
});

app.post('/api/productos', (req, res) => {
  const { descripcion, cantidad_en_stock, precio_compra, fecha_vencimiento } = req.body;

  if (!descripcion || cantidad_en_stock === undefined || !precio_compra) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  const query = 'INSERT INTO productos (descripcion, cantidad_en_stock, precio_compra, fecha_vencimiento) VALUES (?, ?, ?, ?)';
  db.query(query, [descripcion, cantidad_en_stock, precio_compra, fecha_vencimiento], (err, result) => {
    if (err) {
      console.error('Error al insertar datos:', err);
      return res.status(500).json({ error: 'Error al insertar datos' });
    }

    res.status(201).json({ message: 'Producto insertado exitosamente', id: result.insertId });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
