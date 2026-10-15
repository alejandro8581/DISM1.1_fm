const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configuración de conexión a la Base de Datos XAMPP
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fichajes_db', // Asegúrate de que coincida con el nombre que le diste en phpMyAdmin
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 2. Cargar la interfaz de Swagger UI
try {
    const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
    console.log("Aviso: No se encontró swagger.yaml. La ruta /docs no estará disponible.");
}

// ==========================================
// ENDPOINTS DE USUARIOS
// ==========================================
app.get('/api/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios');
        res.json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE IdUsuario = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(rows[0]);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/usuarios', async (req, res) => {
    try {
        const { IdUsuario, Nombre, Usuario, Clave } = req.body;
        await pool.query(
            'INSERT INTO Usuarios (IdUsuario, Nombre, Usuario, Clave) VALUES (?, ?, ?, ?)',
            [IdUsuario, Nombre, Usuario, Clave]
        );
        res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { Nombre, Usuario, Clave } = req.body;
        await pool.query(
            'UPDATE Usuarios SET Nombre = ?, Usuario = ?, Clave = ? WHERE IdUsuario = ?',
            [Nombre, Usuario, Clave, req.params.id]
        );
        res.json({ message: 'Usuario actualizado' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Usuarios WHERE IdUsuario = ?', [req.params.id]);
        res.json({ message: 'Usuario eliminado' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// ENDPOINTS DE TRABAJOS
// ==========================================
app.get('/api/trabajos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Trabajos');
        res.json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/trabajos', async (req, res) => {
    try {
        const { IdTrabajo, Nombre } = req.body;
        await pool.query('INSERT INTO Trabajos (IdTrabajo, Nombre) VALUES (?, ?)', [IdTrabajo, Nombre]);
        res.status(201).json({ message: 'Trabajo creado' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/trabajos/:id', async (req, res) => {
    try {
        const { Nombre } = req.body;
        await pool.query('UPDATE Trabajos SET Nombre = ? WHERE IdTrabajo = ?', [Nombre, req.params.id]);
        res.json({ message: 'Trabajo actualizado' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/trabajos/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Trabajos WHERE IdTrabajo = ?', [req.params.id]);
        res.json({ message: 'Trabajo eliminado' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// ENDPOINTS DE FICHAJES
// ==========================================
app.get('/api/fichajes', async (req, res) => {
    try {
        const { idUsuario, fechaInicio, fechaFin, estado } = req.query;
        let query = 'SELECT * FROM Fichajes WHERE 1=1';
        let params = [];

        // Filtros dinámicos para la AppAdmin y AppUsuarios
        if (idUsuario) {
            query += ' AND IdUsuario = ?';
            params.push(idUsuario);
        }
        if (fechaInicio && fechaFin) {
            query += ' AND FechaHoraEntrada BETWEEN ? AND ?';
            params.push(fechaInicio, fechaFin);
        }
        if (estado === 'abierto') {
            query += ' AND FechaHoraSalida IS NULL';
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/fichajes', async (req, res) => {
    try {
        const { FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Fichajes (FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud) VALUES (?, ?, ?, ?, ?)',
            [FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud]
        );
        res.status(201).json({ message: 'Fichaje registrado', idFichaje: result.insertId });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/fichajes/:id', async (req, res) => {
    try {
        const { FechaHoraSalida, HorasTrabajadas } = req.body;
        await pool.query(
            'UPDATE Fichajes SET FechaHoraSalida = ?, HorasTrabajadas = ? WHERE IdFichaje = ?',
            [FechaHoraSalida, HorasTrabajadas, req.params.id]
        );
        res.json({ message: 'Fichaje finalizado correctamente' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/fichajes/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Fichajes WHERE IdFichaje = ?', [req.params.id]);
        res.json({ message: 'Fichaje eliminado' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// ENDPOINT OPTATIVO: LOGIN
// ==========================================
app.post('/api/login', async (req, res) => {
    try {
        const { usuario, clave } = req.body;
        const [rows] = await pool.query(
            'SELECT * FROM Usuarios WHERE Usuario = ? AND Clave = ?',
            [usuario, clave]
        );
        
        if (rows.length > 0) {
            res.json({ success: true, usuario: rows[0] });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// INICIO DEL SERVIDOR
// ==========================================
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor API REST corriendo en http://localhost:${PORT}/api`);
    console.log(`Documentación Swagger disponible en http://localhost:${PORT}/docs`);
});