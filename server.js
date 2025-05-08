const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión MySQL (rellena con tus datos si vas a deployar)
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'tareas'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Obtener todas las tareas
app.get('/api/tareas', (req, res) => {
  db.query('SELECT * FROM tareas', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Agregar una tarea
app.post('/api/tareas', (req, res) => {
  const { tarea } = req.body;
  db.query('INSERT INTO tareas (tarea) VALUES (?)', [tarea], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Tarea agregada');
  });
});

// Marcar como completada
app.put('/api/tareas/:id', (req, res) => {
  db.query('UPDATE tareas SET completado = NOT completado WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Tarea actualizada');
  });
});

// Eliminar tarea
app.delete('/api/tareas/:id', (req, res) => {
  db.query('DELETE FROM tareas WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Tarea eliminada');
  });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
