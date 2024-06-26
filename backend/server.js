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

// Ruta para el login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const sql = 'SELECT * FROM Usuario WHERE nombre_usuario = ? AND contrasena = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL:', err);
      return res.status(500).json({ error: 'Error fetching data from MySQL' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrecta' });
    }

    const user = results[0];
    
    const adminSql = 'SELECT * FROM Administrador WHERE id_usuario = ?';
    db.query(adminSql, [user.id_usuario], (err, adminResults) => {
      if (err) {
        console.error('Error fetching data from MySQL:', err);
        return res.status(500).json({ error: 'Error fetching data from MySQL' });
      }

      if (adminResults.length > 0) {
        return res.json({ role: 'admin', userId: user.id_usuario });
      } else {
        const alumnoSql = 'SELECT * FROM Alumno WHERE id_usuario = ?';
        db.query(alumnoSql, [user.id_usuario], (err, alumnoResults) => {
          if (err) {
            console.error('Error fetching data from MySQL:', err);
            return res.status(500).json({ error: 'Error fetching data from MySQL' });
          }

          if (alumnoResults.length > 0) {
            return res.json({ role: 'alumno', userId: user.id_usuario, alumnoId: alumnoResults[0].id_alumno });
          } else {
            return res.status(403).json({ error: 'No tienes asignado un rol en el sistema' });
          }
        });
      }
    });
  });
});


app.post('/predicciones', (req, res) => {
  const { id_partido, pred_goles_equ1, pred_goles_equ2, id_alumno, ganador_pred } = req.body;

  if (!id_partido || pred_goles_equ1 === undefined || pred_goles_equ2 === undefined || !id_alumno || !ganador_pred) {
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
      const updatePredictionSql = 'UPDATE Prediccion SET pred_goles_equ1 = ?, pred_goles_equ2 = ?, ganador_pred = ? WHERE id_partido = ? AND id_alumno = ?';
      db.query(updatePredictionSql, [pred_goles_equ1, pred_goles_equ2, ganador_pred, id_partido, id_alumno], (err, result) => {
        if (err) {
          console.error('Error updating prediction in MySQL:', err);
          return res.status(500).json({ error: 'Error updating prediction' });
        }
        res.status(200).json({ message: 'Prediction updated successfully' });
      });
    } else {
      // No existe predicción, insertar nueva
      const insertPredictionSql = 'INSERT INTO Prediccion (id_partido, pred_goles_equ1, pred_goles_equ2, id_alumno, ganador_pred) VALUES (?, ?, ?, ?, ?)';
      db.query(insertPredictionSql, [id_partido, pred_goles_equ1, pred_goles_equ2, id_alumno, ganador_pred], (err, result) => {
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
  SELECT 
    p.id_partido, 
    p.fecha, 
    p.fase, 
    l.nombre_estadio, 
    e1.nombre_equipo AS equipo1, 
    e2.nombre_equipo AS equipo2 
  FROM 
    Partido p 
  LEFT JOIN 
    Locacion l ON p.id_loc = l.id_loc 
  LEFT JOIN 
    Equipo e1 ON p.id_equipo1 = e1.id_equipo 
  LEFT JOIN 
    Equipo e2 ON p.id_equipo2 = e2.id_equipo
  ORDER BY 
    p.id_partido
`;;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL:', err);
      return res.status(500).json({ error: 'Error fetching data' });
    }
    res.json(results);
  });
});

// Ruta para el registro
app.post('/register', (req, res) => {
  const { username, email, password, id_carrera, pred_champ, pred_subchamp } = req.body;

  // Verificar si el correo ya está registrado
  const checkEmailSql = 'SELECT * FROM Usuario WHERE mail = ?';
  db.query(checkEmailSql, [email], (err, results) => {
    if (err) {
      console.error('Error checking email in MySQL:', err);
      return res.status(500).json({ error: 'Error checking email' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Correo electrónico ya registrado' });
    }

    // Insertar nuevo usuario
    const insertUserSql = 'INSERT INTO Usuario (nombre_usuario, contrasena, mail) VALUES (?, ?, ?)';
    db.query(insertUserSql, [username, password, email], (err, result) => {
      if (err) {
        console.error('Error inserting user into MySQL:', err);
        return res.status(500).json({ error: 'Error inserting user' });
      }

      const userId = result.insertId;

      // Insertar nuevo alumno
      const insertAlumnoSql = 'INSERT INTO Alumno (id_usuario, id_carrera, puntaje, pred_champ, pred_subchamp) VALUES (?, ?, 0, ?, ?)';
      db.query(insertAlumnoSql, [userId, id_carrera, pred_champ, pred_subchamp], (err, result) => {
        if (err) {
          console.error('Error inserting student into MySQL:', err);
          return res.status(500).json({ error: 'Error inserting student' });
        }

        res.status(201).json({ message: 'Registro exitoso' });
      });
    });
  });
});

// Ruta para obtener carreras
app.get('/carreras', (req, res) => {
  const sql = 'SELECT * FROM Carrera';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching careers from MySQL:', err);
      return res.status(500).json({ error: 'Error fetching careers' });
    }
    res.json(results);
  });
});

// Ruta para obtener equipos
app.get('/equipos', (req, res) => {
  const sql = 'SELECT * FROM Equipo';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching teams from MySQL:', err);
      return res.status(500).json({ error: 'Error fetching teams' });
    }
    res.json(results);
  });
});


app.get('/resultados', (req, res) => {
  const sql = `
    SELECT r.id_partido, r.ganador, r.goles_equipo1, r.goles_equipo2
    FROM Resultado r
    JOIN Partido p ON r.id_partido = p.id_partido
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching results from MySQL:', err);
      return res.status(500).json({ error: 'Error fetching results' });
    }
    res.json(results);
  });
});

app.post('/resultados', (req, res) => {
  const { id_partido, goles_equipo1, goles_equipo2, ganador } = req.body;

  if (!id_partido || goles_equipo1 === undefined || goles_equipo2 === undefined || ganador === null) {
      console.error('Invalid request data:', req.body);
      return res.status(400).json({ error: 'Invalid request data' });
  }

  console.log('Received result data:', req.body);

  const checkResultSql = 'SELECT * FROM Resultado WHERE id_partido = ?';
  db.query(checkResultSql, [id_partido], (err, results) => {
      if (err) {
          console.error('Error checking result in MySQL:', err);
          return res.status(500).json({ error: 'Error checking result' });
      }

      const finalCheckSql = 'SELECT fase FROM Partido WHERE id_partido = ?';
      db.query(finalCheckSql, [id_partido], (err, matchResults) => {
          if (err) {
              console.error('Error checking match phase in MySQL:', err);
              return res.status(500).json({ error: 'Error checking match phase' });
          }

          const isFinal = matchResults[0]?.fase === 'Final';

          if (results.length > 0) {
              // Resultado existente, actualizar
              const updateResultSql = 'UPDATE Resultado SET goles_equipo1 = ?, goles_equipo2 = ?, ganador = ? WHERE id_partido = ?';
              db.query(updateResultSql, [goles_equipo1, goles_equipo2, ganador, id_partido], (err, result) => {
                  if (err) {
                      console.error('Error updating result in MySQL:', err);
                      return res.status(500).json({ error: 'Error updating result' });
                  }
                  updateScores(id_partido, goles_equipo1, goles_equipo2, ganador, isFinal);
                  res.status(200).json({ message: 'Result updated successfully' });
              });
          } else {
              // No existe resultado, insertar nuevo
              const insertResultSql = 'INSERT INTO Resultado (id_partido, goles_equipo1, goles_equipo2, ganador) VALUES (?, ?, ?, ?)';
              db.query(insertResultSql, [id_partido, goles_equipo1, goles_equipo2, ganador], (err, result) => {
                  if (err) {
                      console.error('Error inserting result into MySQL:', err);
                      return res.status(500).json({ error: 'Error inserting result' });
                  }
                  updateScores(id_partido, goles_equipo1, goles_equipo2, ganador, isFinal);
                  res.status(201).json({ message: 'Result inserted successfully' });
              });
          }
      });
  });
});

// Función para actualizar los puntajes de los alumnos
function updateScores(id_partido, goles_equipo1, goles_equipo2, ganador, isFinal) {
  const getPredictionsSql = `
    SELECT p.id_alumno, p.pred_goles_equ1, p.pred_goles_equ2, p.ganador_pred, a.puntaje
    FROM Prediccion p
    JOIN Alumno a ON p.id_alumno = a.id_alumno
    WHERE p.id_partido = ?`;
  
  db.query(getPredictionsSql, [id_partido], (err, predictions) => {
    if (err) {
      console.error('Error fetching predictions from MySQL:', err);
      return;
    }

    predictions.forEach(prediction => {
      let points = 0;

      if (prediction.pred_goles_equ1 === goles_equipo1 && prediction.pred_goles_equ2 === goles_equipo2) {
        points += 4; // 4 puntos por acertar los goles
      }

      if (prediction.ganador_pred === ganador) {
        points += 2; // 2 puntos por acertar el ganador o el empate
      }

      const newScore = prediction.puntaje + points;

      const updateScoreSql = 'UPDATE Alumno SET puntaje = ? WHERE id_alumno = ?';
      db.query(updateScoreSql, [newScore, prediction.id_alumno], (err, result) => {
        if (err) {
          console.error('Error updating score in MySQL:', err);
          return;
        }
        console.log(`Updated score for alumno ${prediction.id_alumno}: +${points} points`);
      });
    });
  });

  if (isFinal) {
    updateChampionScores(ganador, id_partido);
  }
}

// Función para actualizar los puntajes por acertar el campeón y subcampeón
function updateChampionScores(ganador, id_partido) {
  const getFinalTeamsSql = 'SELECT equipo1, equipo2 FROM Partido WHERE id_partido = ?';
  db.query(getFinalTeamsSql, [id_partido], (err, results) => {
    if (err) {
      console.error('Error fetching final teams from MySQL:', err);
      return;
    }

    const finalTeams = results[0];
    const subcampeon = (ganador === finalTeams.equipo1) ? finalTeams.equipo2 : finalTeams.equipo1;

    const getPredictionsSql = 'SELECT * FROM Alumno';
    db.query(getPredictionsSql, (err, students) => {
      if (err) {
        console.error('Error fetching student predictions from MySQL:', err);
        return;
      }

      students.forEach(student => {
        let puntos = 0;
        if (student.pred_champ === ganador) {
          puntos += 10;
        }
        if (student.pred_subchamp === subcampeon) {
          puntos += 5;
        }

        if (puntos > 0) {
          const updatePuntajeSql = 'UPDATE Alumno SET puntaje = puntaje + ? WHERE id_alumno = ?';
          db.query(updatePuntajeSql, [puntos, student.id_alumno], (err, result) => {
            if (err) {
              console.error('Error updating student score in MySQL:', err);
            } else {
              console.log(`Updated score for alumno ${student.id_alumno}: +${puntos} points`);
            }
          });
        }
      });
    });
  });
}

// Ruta para obtener el ranking de alumnos
app.get('/ranking', (req, res) => {
  const sql = `
    SELECT 
      Usuario.nombre_usuario,
      Carrera.nombre_carrera,
      Alumno.puntaje
    FROM Alumno
    JOIN Usuario ON Alumno.id_usuario = Usuario.id_usuario
    JOIN Carrera ON Alumno.id_carrera = Carrera.id_carrera
    ORDER BY Alumno.puntaje DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching ranking from MySQL:', err);
      return res.status(500).json({ error: 'Error fetching ranking' });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
