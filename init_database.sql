CREATE DATABASE PencaUCU;
USE PencaUCU;

CREATE TABLE Alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  valor INT
);

INSERT INTO Alumnos (nombre, valor) VALUES ('Jose Varela', 48477706);
