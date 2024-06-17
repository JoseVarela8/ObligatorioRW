const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Asegúrate de que este middleware está habilitado para parsear JSON

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

app.post('/predicciones', (req, res) => {
  const { id_partido, pred_goles_equ1, pred_goles_equ2, id_alumno } = req.body;

  if (!id_partido || pred_goles_equ1 === undefined || pred_goles_equ2 === undefined || !id_alumno) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  const checkPredictionSql = 'SELECT * FROM Prediccion WHERE id_partido = ? AND id_alumno = ?';
  db.query(checkPredictionSql, [id_partido, id_alumno], (err, results) => {
    if (err) {
      console.error('Error checking prediction in MySQL:', err);
      return res.status(500).json({ error: 'Error checking prediction' });
    }

    if (results.length > 0) {
      // Predicción existente, actualizar
      const updatePredictionSql = 'UPDATE Prediccion SET pred_goles_equ1 = ?, pred_goles_equ2 = ? WHERE id_partido = ? AND id_alumno = ?';
      db.query(updatePredictionSql, [pred_goles_equ1, pred_goles_equ2, id_partido, id_alumno], (err, result) => {
        if (err) {
          console.error('Error updating prediction in MySQL:', err);
          return res.status(500).json({ error: 'Error updating prediction' });
        }
        res.status(200).json({ message: 'Prediction updated successfully' });
      });
    } else {
      // No existe predicción, insertar nueva
      const insertPredictionSql = 'INSERT INTO Prediccion (id_partido, pred_goles_equ1, pred_goles_equ2, id_alumno) VALUES (?, ?, ?, ?)';
      db.query(insertPredictionSql, [id_partido, pred_goles_equ1, pred_goles_equ2, id_alumno], (err, result) => {
        if (err) {
          console.error('Error inserting prediction into MySQL:', err);
          return res.status(500).json({ error: 'Error inserting prediction' });
        }
        res.status(201).json({ message: 'Prediction inserted successfully' });
      });
    }
  });
});

app.get('/predicciones/:id_alumno', (req, res) => {
  const { id_alumno } = req.params;

  const sql = `
    SELECT p.id_partido, pred.pred_goles_equ1, pred.pred_goles_equ2, pred.id_alumno
    FROM Prediccion pred
    JOIN Partido p ON pred.id_partido = p.id_partido
    WHERE pred.id_alumno = ?
  `;
  db.query(sql, [id_alumno], (err, results) => {
    if (err) {
      console.error('Error fetching predictions from MySQL:', err);
      return res.status(500).json({ error: 'Error fetching predictions' });
    }
    res.json(results);
  });
});

app.get('/partidos', (req, res) => {
  const sql = `
    SELECT p.id_partido, p.fecha, p.fase, l.nombre_estadio, e1.nombre_equipo AS equipo1, e2.nombre_equipo AS equipo2 
    FROM Partido p 
    JOIN Locacion l ON p.id_loc = l.id_loc 
    JOIN Equipo e1 ON p.id_equipo1 = e1.id_equipo 
    JOIN Equipo e2 ON p.id_equipo2 = e2.id_equipo
    ORDER BY p.id_partido
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL:', err);
      return res.status(500).json({ error: 'Error fetching data' });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
