const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: '*'
}));

// Middleware para parsear JSON
app.use(express.json());

// Configurar conexión a MySQL
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  charset: 'utf8mb4'  // Asegurar que la conexión usa la codificación correcta
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
  const sql = 'INSERT INTO Alumno (nombre, valor) VALUES (?, ?)';
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
  const sql = 'UPDATE Alumno SET nombre = ?, valor = ? WHERE id_alumno = ?';
  db.query(sql, [nombre, valor, id], (err, results) => {
    if (err) {
      console.error('Error updating MySQL:', err);
      return res.status(500).send('Error updating MySQL');
    }
    res.send(`Alumno updated with ID: ${id}`);
  });
});

// Crear una ruta para obtener todos los partidos
app.get('/partidos', (req, res) => {
  const sql = `
    SELECT p.id_partido, p.fecha, p.fase, l.nombre_estadio, e1.nombre_equipo AS equipo1, e2.nombre_equipo AS equipo2 
    FROM Partido p 
    JOIN Locacion l ON p.id_loc = l.id_loc 
    JOIN Equipo e1 ON p.id_equipo1 = e1.id_equipo 
    JOIN Equipo e2 ON p.id_equipo2 = e2.id_equipo
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL:', err);
      return res.status(500).send('Error fetching data from MySQL');
    }
    res.json(results);
  });
});

// Servir archivos estáticos
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

