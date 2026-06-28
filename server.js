const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexión a la base de datos original de productos (Ajustá el host si también la moviste a la Raspberry)
const poolProductos = new Pool({
  user: "postgres",
  host: "localhost",
  database: "inventoryBD",
  password: "admin",
  port: 5432,
});

// 2. NUEVA Conexión a la Raspberry Pi para los usuarios
const poolUsuarios = new Pool({
  user: "postgres",
  host: "192.168.2.101", // IP de la Raspberry Pi
  database: "inventoryCloud",
  password: "admin", // La que configuraste con \password
  port: 5432,
});

// Ruta original: Obtener productos
app.get("/api/productos", async (req, res) => {
  try {
    const result = await poolProductos.query("SELECT * FROM productos");
    res.json(result.rows);
  } catch (err) {
    console.error("Error en productos:", err.message);
    res.status(500).send("Error en el servidor de productos");
  }
});

// NUEVA Ruta: Obtener usuarios desde la Raspberry Pi
app.get("/api/usuarios", async (req, res) => {
  try {
    const result = await poolUsuarios.query("SELECT * FROM usuario");
    res.json(result.rows);
  } catch (err) {
    console.error("Error en usuarios:", err.message);
    res.status(500).send("Error en el servidor de usuarios");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
