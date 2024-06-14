const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configurar conexión a MySQL
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Crear una ruta para insertar un nuevo alumno
app.post('/alumnos', (req, res) => {
  console.log('Solicitud POST recibida:', req.body);
  const { nombre, valor } = req.body;
  const sql = 'INSERT INTO Alumnos (nombre, valor) VALUES (?, ?)';
  db.query(sql, [nombre, valor], (err, results) => {
    if (err) {
      console.error('Error inserting into MySQL:', err);
      return res.status(500).send('Error inserting into MySQL');
    }
    res.status(201).send(`Alumno added with ID: ${results.insertId}`);
  });
});

// Crear una ruta para actualizar un alumno
app.put('/alumnos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, valor } = req.body;
  const sql = 'UPDATE Alumnos SET nombre = ?, valor = ? WHERE id = ?';
  db.query(sql, [nombre, valor, id], (err, results) => {
    if (err) {
      console.error('Error updating MySQL:', err);
      return res.status(500).send('Error updating MySQL');
    }
    res.send(`Alumno updated with ID: ${id}`);
  });
});

// Servir archivos estáticos
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
