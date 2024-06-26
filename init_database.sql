CREATE DATABASE IF NOT EXISTS PencaUCU CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE PencaUCU;

-- Tabla Usuario
CREATE TABLE IF NOT EXISTS Usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre_usuario VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  contrasena VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  mail VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla Admin
CREATE TABLE IF NOT EXISTS Administrador (
  id_admin INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla Carrera
CREATE TABLE IF NOT EXISTS Carrera (
  id_carrera INT AUTO_INCREMENT PRIMARY KEY,
  nombre_carrera VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla Alumno
CREATE TABLE IF NOT EXISTS Alumno (
  id_alumno INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  id_carrera INT,
  puntaje INT,
  pred_champ VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  pred_subchamp VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
  FOREIGN KEY (id_carrera) REFERENCES Carrera(id_carrera)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla Equipo
CREATE TABLE IF NOT EXISTS Equipo (
  id_equipo INT AUTO_INCREMENT PRIMARY KEY,
  nombre_equipo VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla Locacion
CREATE TABLE IF NOT EXISTS Locacion (
  id_loc INT AUTO_INCREMENT PRIMARY KEY,
  estado VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  ciudad VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  nombre_estadio VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla Partido
CREATE TABLE IF NOT EXISTS Partido (
  id_partido INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATETIME,
  fase VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  id_loc INT,
  id_equipo1 INT,
  id_equipo2 INT,
  FOREIGN KEY (id_loc) REFERENCES Locacion(id_loc),
  FOREIGN KEY (id_equipo1) REFERENCES Equipo(id_equipo),
  FOREIGN KEY (id_equipo2) REFERENCES Equipo(id_equipo)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla Resultado
CREATE TABLE IF NOT EXISTS Resultado (
  id_res INT AUTO_INCREMENT PRIMARY KEY,
  id_partido INT,
  ganador VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  goles_equipo1 INT,
  goles_equipo2 INT,
  FOREIGN KEY (id_partido) REFERENCES Partido(id_partido)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla Prediccion
CREATE TABLE IF NOT EXISTS Prediccion (
  id_pred INT AUTO_INCREMENT PRIMARY KEY,
  id_partido INT,
  pred_goles_equ1 INT,
  pred_goles_equ2 INT,
  id_alumno INT,
  ganador_pred VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  FOREIGN KEY (id_partido) REFERENCES Partido(id_partido),
  FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
);


-- Relación Registra (N-N entre Admin y Resultado)
CREATE TABLE IF NOT EXISTS Registra (
  id_admin INT,
  id_res INT,
  PRIMARY KEY (id_admin, id_res),
  FOREIGN KEY (id_admin) REFERENCES Administrador(id_admin),
  FOREIGN KEY (id_res) REFERENCES Resultado(id_res)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Inserción de datos
INSERT INTO Equipo (nombre_equipo) VALUES 
('Argentina'),
('Bolivia'),
('Brasil'),
('Canada'),
('Chile'),
('Colombia'),
('Costa Rica'),
('Ecuador'),
('Estados Unidos'),
('Jamaica'),
('Mexico'),
('Panama'),
('Paraguay'),
('Peru'),
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

INSERT INTO Partido (fecha, fase, id_equipo1, id_equipo2, id_loc) VALUES 
('2024-06-20 20:00:00', 'Grupo A', 1, 4, 1),
('2024-06-21 19:00:00', 'Grupo A', 14, 5, 5),
('2024-06-22 20:00:00', 'Grupo B', 11, 10, 9),
('2024-06-22 15:00:00', 'Grupo B', 8, 16, 14),
('2024-06-23 17:00:00', 'Grupo C', 9, 2, 5),
('2024-06-23 21:00:00', 'Grupo C', 15, 12, 2),
('2024-06-24 18:00:00', 'Grupo D', 3, 7, 10),
('2024-06-24 17:00:00', 'Grupo D', 6, 13, 9),
('2024-06-25 21:00:00', 'Grupo A', 5, 1, 7),
('2024-06-25 17:00:00', 'Grupo A', 14, 4, 11),
('2024-06-26 18:00:00', 'Grupo B', 16, 11, 10),
('2024-06-26 15:00:00', 'Grupo B', 8, 10, 12),
('2024-06-27 18:00:00', 'Grupo C', 12, 9, 1),
('2024-06-27 21:00:00', 'Grupo C', 15, 2, 7),
('2024-06-28 18:00:00', 'Grupo D', 13, 3, 12),
('2024-06-28 15:00:00', 'Grupo D', 6, 7, 8),
('2024-06-29 20:00:00', 'Grupo A', 1, 14, 2),
('2024-06-29 20:00:00', 'Grupo A', 4, 5, 13),
('2024-06-30 17:00:00', 'Grupo B', 11, 8, 8),
('2024-06-30 19:00:00', 'Grupo B', 10, 16, 4),
('2024-07-01 20:00:00', 'Grupo C', 9, 15, 3),
('2024-07-01 21:00:00', 'Grupo C', 2, 12, 13),
('2024-07-02 18:00:00', 'Grupo D', 3, 6, 14),
('2024-07-02 20:00:00', 'Grupo D', 7, 13, 4),
('2024-07-04 20:00:00', 'Cuartos', NULL, NULL, 9),
('2024-07-05 20:00:00', 'Cuartos', NULL, NULL, 5),
('2024-07-06 18:00:00', 'Cuartos', NULL, NULL, 12),
('2024-07-06 15:00:00', 'Cuartos', NULL, NULL, 8),
('2024-07-09 20:00:00', 'Semifinal', NULL, NULL, 7),
('2024-07-10 20:00:00', 'Semifinal', NULL, NULL, 6),
('2024-07-13 20:00:00', 'Tercer Puesto', NULL, NULL, 6),
('2024-07-14 20:00:00', 'Final', NULL, NULL, 2);

-- Insertar Carreras
INSERT INTO Carrera (nombre_carrera) VALUES
('Ingenieria Informatica'),
('Ingenieria Industrial'),
('Medicina'),
('Nutricion'),
('Psicologia'),
('Economia'),
('Contador Publico'),
('Negocios Internacionales'),
('Comunicacion'),
('Derecho');

-- Insertar Usuarios
INSERT INTO Usuario (nombre_usuario, contrasena, mail) VALUES
('admin1', 'admin', 'admin1@example.com'),
('admin2', 'admin', 'admin2@example.com'),
('estudiante1', 'estudiante', 'estudiante1@example.com'),
('estudiante2', 'estudiante', 'estudiante2@example.com'),
('estudiante3', 'estudiante', 'estudiante3@example.com');

-- Insertar Admins
INSERT INTO Administrador (id_usuario) VALUES
((SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'admin1')),
((SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'admin2'));

-- Insertar Alumno
INSERT INTO Alumno (id_usuario, id_carrera, puntaje, pred_champ, pred_subchamp) VALUES
((SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'estudiante1'), 
 (SELECT id_carrera FROM Carrera WHERE nombre_carrera = 'Ingenieria Informatica'),
 0, -- Puntaje inicial
 'Argentina', -- Predicción de campeón inicial
 'Brasil' -- Predicción de subcampeón inicial
),
((SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'estudiante2'), 
 (SELECT id_carrera FROM Carrera WHERE nombre_carrera = 'Ingenieria Informatica'),
 0, -- Puntaje inicial
 'Venezuela', -- Predicción de campeón inicial
 'Paraguay' -- Predicción de subcampeón inicial
);