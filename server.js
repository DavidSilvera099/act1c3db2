const express = require('express');
const mysql = require('mysql2');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// Exportar la conexión de la base de datos para usarla en otros archivos
module.exports = db;

// Importar y usar las rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Importar y usar el middleware de verificación de token
const verifyToken = require('./routes/middleware');

// Ruta protegida
app.get('/protected', verifyToken, (req, res) => {
  res.send('This is a protected route');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
