const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

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

// Crear una ruta para obtener datos de la base de datos
app.get('/datos', (req, res) => {
  const sql = 'SELECT * FROM Alumnos';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      return res.status(500).send('Error querying MySQL');
    }
    res.json(results);
  });
});

// Servir archivos estáticos
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

