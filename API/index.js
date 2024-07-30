const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '34.122.212.254',
  user: 'DBA',
  password: 'Kgv<]?|2xagvrR5u',
  database: 'inventario'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos establecida.');
  }
});

app.post('/api/sucursales', (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la sucursal es obligatorio' });
  }

  const query = 'INSERT INTO sucursales (nombre) VALUES (?)';
  db.query(query, [nombre], (err, result) => {
    if (err) {
      console.error('Error al insertar sucursal:', err);
      return res.status(500).json({ error: 'Error al insertar sucursal' });
    }

    res.status(201).json({ message: 'Sucursal insertada exitosamente', id: result.insertId });
  });
});

app.post('/api/productos', (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre || !descripcion) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud (nombre, descripcion)' });
  }

  const query = 'INSERT INTO productos (nombre, descripcion) VALUES (?, ?)';
  db.query(query, [nombre, descripcion], (err, result) => {
    if (err) {
      console.error('Error al insertar producto:', err);
      return res.status(500).json({ error: 'Error al insertar producto' });
    }

    res.status(201).json({ message: 'Producto insertado exitosamente', id: result.insertId });
  });
});


app.post('/api/productos_sucursales', (req, res) => {
  const { id_producto, id_sucursal, cantidad } = req.body;

  if (!id_producto || !id_sucursal || cantidad === undefined) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud (id_producto, id_sucursal, cantidad)' });
  }


  const insertQuery = 'INSERT INTO productos_sucursales (id_producto, id_sucursal, cantidad) VALUES (?, ?, ?)';
  db.query(insertQuery, [id_producto, id_sucursal, cantidad], (err, result) => {
    if (err) {
      console.error('Error al insertar producto en sucursal:', err);
      return res.status(500).json({ error: 'Error al insertar producto en sucursal' });
    }

    res.status(201).json({ message: 'Producto en sucursal insertado exitosamente', id: result.insertId });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
