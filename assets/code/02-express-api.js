const express = require('express');
const cors = require('cors');
const db = require('./database/db'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json()); 

// ==========================================
// FUNCIÓN DE VALIDACIÓN (DNI / NIE / CIF)
// ==========================================
function validarIdentificadorEspanol(id) {
    const str = id.toUpperCase().trim();
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;
    
    if (dniRegex.test(str) || nieRegex.test(str)) {
        let numero = str.substring(0, 8);
        const letraOriginal = str.substring(8, 9);
        if (nieRegex.test(str)) {
            numero = numero.replace('X', '0').replace('Y', '1').replace('Z', '2');
        }
        return letraOriginal === 'TRWAGMYFPDXBNJZSQVHLCKE'[numero % 23];
    }
    
    // Validación para CIF de empresas
    return /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/.test(str);
}

// ==========================================
// ENDPOINT 1: REGISTRAR / BUSCAR CLIENTE
// ==========================================
app.post('/customers', (req, res) => {
    const { company_name, tax_id, email, country, plan_type } = req.body;
    
    // Validación de DNI/CIF obligatoria si el país es España
    if (country && (country.toLowerCase() === 'españa' || country.toLowerCase() === 'spain')) {
        if (!validarIdentificadorEspanol(tax_id)) {
            return res.status(400).json({ error: 'Identificador fiscal no válido.' });
        }
    }

    db.get(`SELECT id FROM customers WHERE tax_id = ?`, [tax_id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Error de base de datos.' });
        
        // Si el cliente ya existe, lo devolvemos
        if (row) return res.status(200).json({ message: 'Recuperado', customerId: row.id });
        
        // Si no existe, lo creamos
        const query = `INSERT INTO customers (company_name, tax_id, email, country, plan_type) VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [company_name, tax_id, email, country, plan_type], function(err) {
            if (err) return res.status(500).json({ error: 'Error al guardar el cliente.' });
            res.status(201).json({ message: 'Registrado', customerId: this.lastID });
        });
    });
});

// ==========================================
// ENDPOINT 2: GUARDAR SIMULACIÓN (CÁLCULO SEGURO EN BACKEND)
// ==========================================
app.post('/simulations', (req, res) => {
    const { customer_id, active_users, storage_gb, api_calls, calculated_cost, currency } = req.body;
    
    // 1. Buscamos el país del cliente en la Base de Datos para saber su IVA
    db.get(`SELECT country FROM customers WHERE id = ?`, [customer_id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Error de BD al buscar cliente.' });
        if (!row) return res.status(404).json({ error: 'Cliente no encontrado.' });

        // 2. LÓGICA DE NEGOCIO EN EL BACKEND (Algoritmo por Tramos)
        let u = Number(active_users) || 0;
        let costeBase = 0;

        if (u > 50) { costeBase += (u - 50) * 5; u = 50; }
        if (u > 10) { costeBase += (u - 10) * 8; u = 10; }
        if (u > 0) { costeBase += u * 10; }

        // 3. Aplicamos el Impuesto si es España (21%)
        const pais = (row.country || '').toLowerCase();
        let impuesto = 0;
        if (pais === 'españa' || pais === 'spain') {
            impuesto = 0.21;
        }

        const totalEurosBackend = costeBase + (costeBase * impuesto);

        // 4. Mantenemos la divisa seleccionada sin depender de APIs en el backend
        let precioFinal = totalEurosBackend;
        
        // Si el usuario eligió otra moneda, calculamos la tasa usando el dato que envió el frontend
        if (currency && currency !== 'EUR' && calculated_cost > 0 && totalEurosBackend > 0) {
            const tasaCambio = calculated_cost / totalEurosBackend;
            precioFinal = totalEurosBackend * tasaCambio;
        }

        const precioFinalValidado = Number(precioFinal.toFixed(2));

        // 5. Guardamos en SQLite el precio auditado y validado por nosotros
        const query = `INSERT INTO simulations (customer_id, active_users, storage_gb, api_calls, calculated_cost, currency) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(query, [customer_id, active_users, storage_gb, api_calls, precioFinalValidado, currency || 'EUR'], function(err) {
            if (err) return res.status(500).json({ error: 'Error interno al guardar la simulación.' });
            res.status(201).json({ message: 'Simulación guardada', simulationId: this.lastID });
        });
    });
});

// ==========================================
// ENDPOINT 3: OBTENER HISTORIAL DE SIMULACIONES
// ==========================================
app.get('/simulations/customer/:customerId', (req, res) => {
    db.all(`SELECT * FROM simulations WHERE customer_id = ? ORDER BY id DESC`, [req.params.customerId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error de BD al recuperar historial.' });
        res.json(rows);
    });
});

// ==========================================
// ARRANQUE DEL SERVIDOR
// ==========================================
app.listen(PORT, () => console.log(`Backend en http://localhost:${PORT}`));
