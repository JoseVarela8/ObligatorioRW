CREATE DATABASE IF NOT EXISTS PencaUCU;
USE PencaUCU;

-- Tabla Usuario
CREATE TABLE IF NOT EXISTS Usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre_usuario VARCHAR(255),
  contrasena VARCHAR(255),
  mail VARCHAR(255)
);

-- Tabla Admin
CREATE TABLE IF NOT EXISTS Admin (
  id_admin INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- Tabla Carrera
CREATE TABLE IF NOT EXISTS Carrera (
  id_carrera INT AUTO_INCREMENT PRIMARY KEY,
  nombre_carrera VARCHAR(255)
);

-- Tabla Alumno
CREATE TABLE IF NOT EXISTS Alumno (
  id_usuario INT,
  id_carrera INT,
  puntaje INT,
  pred_champ VARCHAR(255),
  pred_subchamp VARCHAR(255),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
  FOREIGN KEY (id_carrera) REFERENCES Carrera(id_carrera)
);

-- Tabla Equipo
CREATE TABLE IF NOT EXISTS Equipo (
  id_equipo INT AUTO_INCREMENT PRIMARY KEY,
  nombre_equipo VARCHAR(255)
);

-- Tabla Locacion
CREATE TABLE IF NOT EXISTS Locacion (
  id_loc INT AUTO_INCREMENT PRIMARY KEY,
  estado VARCHAR(255),
  ciudad VARCHAR(255),
  nombre_estadio VARCHAR(255)
);

-- Tabla Partido
CREATE TABLE IF NOT EXISTS Partido (
  id_partido INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE,
  fase VARCHAR(255),
  id_loc INT,
  id_equipo1 INT,
  id_equipo2 INT,
  FOREIGN KEY (id_loc) REFERENCES Locacion(id_loc),
  FOREIGN KEY (id_equipo1) REFERENCES Equipo(id_equipo),
  FOREIGN KEY (id_equipo2) REFERENCES Equipo(id_equipo)
);

-- Tabla Resultado
CREATE TABLE IF NOT EXISTS Resultado (
  id_res INT AUTO_INCREMENT PRIMARY KEY,
  id_partido INT,
  ganador INT,
  goles_equipo1 INT,
  goles_equipo2 INT,
  FOREIGN KEY (id_partido) REFERENCES Partido(id_partido)
);

-- Tabla Prediccion
CREATE TABLE IF NOT EXISTS Prediccion (
  id_pred INT AUTO_INCREMENT PRIMARY KEY,
  id_alumno INT,
  id_partido INT,
  pred_goles_equ1 INT,
  pred_goles_equ2 INT,
  predic_final VARCHAR(255),
  FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno),
  FOREIGN KEY (id_partido) REFERENCES Partido(id_partido)
);

-- Relación Registra (N-N entre Admin y Resultado)
CREATE TABLE IF NOT EXISTS Registra (
  id_admin INT,
  id_res INT,
  PRIMARY KEY (id_admin, id_res),
  FOREIGN KEY (id_admin) REFERENCES Admin(id_admin),
  FOREIGN KEY (id_res) REFERENCES Resultado(id_res)
);

INSERT INTO Equipos (nombre) VALUES 
('Argentina'),
('Bolivia'),
('Brasil'),
('Canadá'),
('Chile'),
('Colombia'),
('Costa Rica'),
('Ecuador'),
('Estados Unidos'),
('Jamaica'),
('México'),
('Panamá'),
('Paraguay'),
('Perú'),
('Uruguay'),
('Venezuela');

INSERT INTO Locacion (nombre_estadio, ciudad, estado) VALUES 
('Mercedes-Benz Stadium', 'Atlanta', 'GA'),
('Hard Rock Stadium', 'Miami Gardens', 'FL'),
('GEHA Field at Arrowhead Stadium', 'Kansas City', 'MO'),
('Q2 Stadium', 'Austin', 'TX'),
('AT&T Stadium', 'Arlington', 'TX'),
('Bank of America Stadium', 'Charlotte', 'NC'),
('MetLife Stadium', 'East Rutherford', 'NJ'),
('State Farm Stadium', 'Glendale', 'AZ'),
('NRG Stadium', 'Houston', 'TX'),
('SoFi Stadium', 'Inglewood', 'CA'),
('Children’s Mercy Park', 'Kansas City', 'KS'),
('Allegiant Stadium', 'Las Vegas', 'NV'),
('Inter&Co Stadium', 'Orlando', 'FL'),
('Levi’s® Stadium', 'Santa Clara', 'CA');

INSERT INTO Partido (fecha, fase, id_loc, id_equipo1, id_equipo2) VALUES 
('2024-06-20', 'Grupo A', 1, 1, 4),
('2024-06-21', 'Grupo A', 5, 14, 5),
('2024-06-22', 'Grupo B', 9, 11, 10),
('2024-06-22', 'Grupo B', 14, 8, 16),
('2024-06-23', 'Grupo C', 5, 9, 2),
('2024-06-23', 'Grupo C', 2, 15, 12),
('2024-06-21', 'Grupo D', 10, 3, 7),
('2024-06-21', 'Grupo D', 9, 6, 13);