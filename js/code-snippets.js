/**
 * Fragmentos embebidos para funcionar sin servidor (file://).
 * Mantén en sync con assets/code/ cuando uses npx serve.
 */
window.CODE_SNIPPETS = {
  "assets/code/01-dom-bom-localStorage.js": `//Elementos DOM
const  nombreUsuario = document.getElementById('nombreUsuario')
const colorFondo = document.getElementById('colorFondo')
const btnAyuda = document.getElementById('btnAyuda')
const saludo = document.getElementById('parrafoSaludo')
const lista = document.getElementById('lista')

//Recuperar preferencias
const nombreGuardado = localStorage.getItem('usuario')
if(nombreGuardado){
    nombreUsuario.value =nombreGuardado
}
const colorPreferido = localStorage.getItem('colorPreferido')
if(colorPreferido){
    colorFondo.value =document.body.style.background = colorPreferido
}
//Variables para datos

let nombre
let color
let fechaActual= new Date ()
let fechaFormateada = fechaActual.toLocaleDateString()
let hora = fechaActual.getHours()

// Lógica para el saludo
let textoSaludo
if(hora<12){
    textoSaludo = "Buenos días"
    

}else if(hora<20){
    textoSaludo = "Buenas tardes"
 
}else{
    textoSaludo = "Buenas noches"
   
}

saludo.textContent = textoSaludo + ", hoy es " + fechaFormateada

//Cambiamos el color de fondo.

colorFondo.addEventListener('input' , () => {document.body.style.background = colorFondo.value; localStorage.setItem('colorPreferido',colorFondo.value)
})

//Guardamos el usuario

nombreUsuario.addEventListener('input', () =>{
    localStorage.setItem('usuario', nombreUsuario.value)
})

// Información del navegador

/**
 * Obtiene los datos del navegador mediante el BOM y los 
 * muestra en una lista dinámica en el HTML.
 * @returns {void}
 */
function mostrarInformacionSistema(){
    

const infoBom = [
    "Navegador: " + navigator.userAgent,
    "Idioma: " + navigator.language,
    "Resolución: " + screen.width + "x" + screen.height
];
infoBom.forEach(dato =>{
    let nuevoLi =document.createElement('li')
    nuevoLi.textContent = dato
    lista.appendChild(nuevoLi)
})
}

mostrarInformacionSistema()


// 1. Abrimos el evento click
btnAyuda.addEventListener('click', () => {
    
    // 2. Abrimos la ventana.
    const ventanaAyuda = window.open('ayuda.html', 'Ayuda', 'width=400,height=400');

    // 3. Programamos el retraso para enviar el mensaje
    setTimeout(() => {
        // El mensaje se envía a la variable que acabamos de crear arriba
        ventanaAyuda.postMessage("La ayuda anda en camino", "*");
    }, 1000); // 1000 milisegundos = 1 segundo

});`,
};

window.CODE_SNIPPETS["assets/code/02-express-api.js"] = "const express = require('express');\r\nconst cors = require('cors');\r\nconst db = require('./database/db'); \r\n\r\nconst app = express();\r\nconst PORT = process.env.PORT || 3000;\r\n\r\napp.use(cors({ origin: '*' }));\r\napp.use(express.json()); \r\n\r\n// ==========================================\r\n// FUNCIÓN DE VALIDACIÓN (DNI / NIE / CIF)\r\n// ==========================================\r\nfunction validarIdentificadorEspanol(id) {\r\n    const str = id.toUpperCase().trim();\r\n    const dniRegex = /^[0-9]{8}[A-Z]$/;\r\n    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;\r\n    \r\n    if (dniRegex.test(str) || nieRegex.test(str)) {\r\n        let numero = str.substring(0, 8);\r\n        const letraOriginal = str.substring(8, 9);\r\n        if (nieRegex.test(str)) {\r\n            numero = numero.replace('X', '0').replace('Y', '1').replace('Z', '2');\r\n        }\r\n        return letraOriginal === 'TRWAGMYFPDXBNJZSQVHLCKE'[numero % 23];\r\n    }\r\n    \r\n    // Validación para CIF de empresas\r\n    return /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/.test(str);\r\n}\r\n\r\n// ==========================================\r\n// ENDPOINT 1: REGISTRAR / BUSCAR CLIENTE\r\n// ==========================================\r\napp.post('/customers', (req, res) => {\r\n    const { company_name, tax_id, email, country, plan_type } = req.body;\r\n    \r\n    // Validación de DNI/CIF obligatoria si el país es España\r\n    if (country && (country.toLowerCase() === 'españa' || country.toLowerCase() === 'spain')) {\r\n        if (!validarIdentificadorEspanol(tax_id)) {\r\n            return res.status(400).json({ error: 'Identificador fiscal no válido.' });\r\n        }\r\n    }\r\n\r\n    db.get(`SELECT id FROM customers WHERE tax_id = ?`, [tax_id], (err, row) => {\r\n        if (err) return res.status(500).json({ error: 'Error de base de datos.' });\r\n        \r\n        // Si el cliente ya existe, lo devolvemos\r\n        if (row) return res.status(200).json({ message: 'Recuperado', customerId: row.id });\r\n        \r\n        // Si no existe, lo creamos\r\n        const query = `INSERT INTO customers (company_name, tax_id, email, country, plan_type) VALUES (?, ?, ?, ?, ?)`;\r\n        db.run(query, [company_name, tax_id, email, country, plan_type], function(err) {\r\n            if (err) return res.status(500).json({ error: 'Error al guardar el cliente.' });\r\n            res.status(201).json({ message: 'Registrado', customerId: this.lastID });\r\n        });\r\n    });\r\n});\r\n\r\n// ==========================================\r\n// ENDPOINT 2: GUARDAR SIMULACIÓN (CÁLCULO SEGURO EN BACKEND)\r\n// ==========================================\r\napp.post('/simulations', (req, res) => {\r\n    const { customer_id, active_users, storage_gb, api_calls, calculated_cost, currency } = req.body;\r\n    \r\n    // 1. Buscamos el país del cliente en la Base de Datos para saber su IVA\r\n    db.get(`SELECT country FROM customers WHERE id = ?`, [customer_id], (err, row) => {\r\n        if (err) return res.status(500).json({ error: 'Error de BD al buscar cliente.' });\r\n        if (!row) return res.status(404).json({ error: 'Cliente no encontrado.' });\r\n\r\n        // 2. LÓGICA DE NEGOCIO EN EL BACKEND (Algoritmo por Tramos)\r\n        let u = Number(active_users) || 0;\r\n        let costeBase = 0;\r\n\r\n        if (u > 50) { costeBase += (u - 50) * 5; u = 50; }\r\n        if (u > 10) { costeBase += (u - 10) * 8; u = 10; }\r\n        if (u > 0) { costeBase += u * 10; }\r\n\r\n        // 3. Aplicamos el Impuesto si es España (21%)\r\n        const pais = (row.country || '').toLowerCase();\r\n        let impuesto = 0;\r\n        if (pais === 'españa' || pais === 'spain') {\r\n            impuesto = 0.21;\r\n        }\r\n\r\n        const totalEurosBackend = costeBase + (costeBase * impuesto);\r\n\r\n        // 4. Mantenemos la divisa seleccionada sin depender de APIs en el backend\r\n        let precioFinal = totalEurosBackend;\r\n        \r\n        // Si el usuario eligió otra moneda, calculamos la tasa usando el dato que envió el frontend\r\n        if (currency && currency !== 'EUR' && calculated_cost > 0 && totalEurosBackend > 0) {\r\n            const tasaCambio = calculated_cost / totalEurosBackend;\r\n            precioFinal = totalEurosBackend * tasaCambio;\r\n        }\r\n\r\n        const precioFinalValidado = Number(precioFinal.toFixed(2));\r\n\r\n        // 5. Guardamos en SQLite el precio auditado y validado por nosotros\r\n        const query = `INSERT INTO simulations (customer_id, active_users, storage_gb, api_calls, calculated_cost, currency) VALUES (?, ?, ?, ?, ?, ?)`;\r\n        db.run(query, [customer_id, active_users, storage_gb, api_calls, precioFinalValidado, currency || 'EUR'], function(err) {\r\n            if (err) return res.status(500).json({ error: 'Error interno al guardar la simulación.' });\r\n            res.status(201).json({ message: 'Simulación guardada', simulationId: this.lastID });\r\n        });\r\n    });\r\n});\r\n\r\n// ==========================================\r\n// ENDPOINT 3: OBTENER HISTORIAL DE SIMULACIONES\r\n// ==========================================\r\napp.get('/simulations/customer/:customerId', (req, res) => {\r\n    db.all(`SELECT * FROM simulations WHERE customer_id = ? ORDER BY id DESC`, [req.params.customerId], (err, rows) => {\r\n        if (err) return res.status(500).json({ error: 'Error de BD al recuperar historial.' });\r\n        res.json(rows);\r\n    });\r\n});\r\n\r\n// ==========================================\r\n// ARRANQUE DEL SERVIDOR\r\n// ==========================================\r\napp.listen(PORT, () => console.log(`Backend en http://localhost:${PORT}`));\r\n";
window.CODE_SNIPPETS["assets/code/03-php-login.php"] = "<?php\r\n// login.php\r\nrequire_once 'config/database.php';\r\nrequire_once 'includes/security.php';\r\n\r\nif (session_status() === PHP_SESSION_NONE) {\r\n    session_start();\r\n}\r\n\r\n$error = '';\r\n// Umbrales separados para evitar bloquear redes compartidas (CG-NAT)\r\n$max_intentos_email = 5;\r\n$max_intentos_ip = 20;\r\n$ip = $_SERVER['REMOTE_ADDR'];\r\n$mensaje_bloqueo = \"Demasiados intentos fallidos. Por seguridad, el acceso ha sido bloqueado temporalmente, inténtelo de nuevo en unos minutos.\";\r\n\r\nif ($_SERVER[\"REQUEST_METHOD\"] == \"POST\") {\r\n    // Comprobamos si el token viene en el POST antes de verificarlo para evitar el Fatal Error de PHP\r\n    if (!isset($_POST['csrf_token']) || empty($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {\r\n        die(\"Error de validación CSRF. Por favor, recarga la página y vuelve a intentarlo.\");\r\n    }\r\n\r\n    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);\r\n    $password = $_POST['password'];\r\n    $db = getDBConnection();\r\n\r\n    // 1. Validar el formato del email\r\n    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {\r\n        $error = \"Credenciales incorrectas.\";\r\n    } else {\r\n        // 2. Control de Fuerza Bruta y Password Spraying (solo contamos los últimos 5 minutos)\r\n        $stmt_ip = $db->prepare(\"SELECT COUNT(*) FROM login_attempts WHERE ip = :ip AND fecha_intento >= (NOW() - INTERVAL 5 MINUTE)\");\r\n        $stmt_ip->execute(['ip' => $ip]);\r\n        $fallos_ip = $stmt_ip->fetchColumn();\r\n\r\n        $stmt_email = $db->prepare(\"SELECT COUNT(*) FROM login_attempts WHERE email = :email AND fecha_intento >= (NOW() - INTERVAL 5 MINUTE)\");\r\n        $stmt_email->execute(['email' => $email]);\r\n        $fallos_email = $stmt_email->fetchColumn();\r\n\r\n        // Si supera CUALQUIERA de los umbrales, muere con el mensaje unificado\r\n        if ($fallos_ip >= $max_intentos_ip || $fallos_email >= $max_intentos_email) {\r\n            die($mensaje_bloqueo);\r\n        }\r\n\r\n        // 3. Consulta de los datos del usuario\r\n        $stmt = $db->prepare(\"SELECT id, nombre, password, rol, activo, email_verificado, tipo_perfil FROM usuarios WHERE email = :email LIMIT 1\");\r\n        $stmt->execute(['email' => $email]);\r\n        $user = $stmt->fetch();\r\n\r\n        // 4. Prevención de Timing Attacks (Tiempo de respuesta constante)\r\n        $dummy_hash = '$2y$10$usesomesillystringfore2uDLvq1Dp/kMwHQI.e.T9.T/1y4Dq';\r\n        $password_valida = false;\r\n\r\n        if ($user) {\r\n            $password_valida = password_verify($password, $user['password']);\r\n        } else {\r\n            password_verify($password, $dummy_hash);\r\n        }\r\n\r\n        if ($user && $password_valida) {\r\n            // Login exitoso: Borramos los fallos específicos de este usuario desde esta IP\r\n            $db->prepare(\"DELETE FROM login_attempts WHERE ip = :ip AND email = :email\")->execute(['ip' => $ip, 'email' => $email]);\r\n\r\n            if (!$user['email_verificado']) {\r\n                $_SESSION['email_rescate'] = $email;\r\n                header(\"Location: registro.php\");\r\n                exit;\r\n            } elseif (!$user['activo']) {\r\n                $error = \"Tu cuenta está desactivada. Contacta con la administración del club.\";\r\n            } else {\r\n                session_regenerate_id(true);\r\n                $_SESSION['usuario_id'] = $user['id'];\r\n                $_SESSION['nombre'] = $user['nombre'];\r\n                $_SESSION['rol'] = $user['rol'];\r\n                $_SESSION['tipo_perfil'] = $user['tipo_perfil'];\r\n\r\n                // 5. Prevención estricta de Open Redirect\r\n                if (isset($_SESSION['redirect_after_login'])) {\r\n                    $url_destino = $_SESSION['redirect_after_login'];\r\n                    unset($_SESSION['redirect_after_login']);\r\n\r\n                    $parsed = parse_url($url_destino);\r\n                    if (empty($parsed['scheme']) && empty($parsed['host']) && strpos($url_destino, '//') === false) {\r\n                        header(\"Location: \" . $url_destino);\r\n                    } else {\r\n                        header(\"Location: usuario/dashboard.php\");\r\n                    }\r\n                } elseif ($user['rol'] === 'admin') {\r\n                    header(\"Location: admin/dashboard.php\");\r\n                } elseif ($user['tipo_perfil'] === 'solo_torneo') {\r\n                    header(\"Location: usuario/mis_torneos.php\");\r\n                } else {\r\n                    header(\"Location: usuario/dashboard.php\");\r\n                }\r\n                exit;\r\n            }\r\n        } else {\r\n            // Login fallido: Insertamos el fallo\r\n            $sql_fail = \"INSERT INTO login_attempts (ip, email) VALUES (:ip, :email)\";\r\n            $db->prepare($sql_fail)->execute(['ip' => $ip, 'email' => $email]);\r\n\r\n            if (($fallos_ip + 1) >= $max_intentos_ip || ($fallos_email + 1) >= $max_intentos_email) {\r\n                $error = $mensaje_bloqueo;\r\n            } else {\r\n                $error = \"Credenciales incorrectas.\";\r\n            }\r\n        }\r\n    }\r\n}\r\n?>\r\n<!DOCTYPE html>\r\n<html lang=\"es\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Login</title>\r\n    <link rel=\"stylesheet\" href=\"assets/css/style.css?v=<?= filemtime('assets/css/style.css') ?>\">\r\n</head>\r\n<body class=\"bg-tennis\">\r\n    <div class=\"auth-container glass-overlay\">\r\n        <form id=\"loginForm\" method=\"POST\" action=\"login.php\" class=\"auth-form modern-form\">\r\n            <div class=\"form-header\">\r\n                <h2>Acceso a la Liga</h2>\r\n                <p>Introduce tus credenciales para continuar</p>\r\n            </div>\r\n\r\n            <?php if ($error): ?>\r\n                <div class=\"alert alert-error\"><?= sanitizeOutput($error) ?></div>\r\n            <?php endif; ?>\r\n\r\n            <input type=\"hidden\" name=\"csrf_token\" value=\"<?= generateCSRFToken() ?>\">\r\n\r\n            <div class=\"form-group modern-input\">\r\n                <label for=\"email\">Correo Electrónico</label>\r\n                <input type=\"email\" id=\"email\" name=\"email\" placeholder=\"ejemplo@correo.com\" required autocomplete=\"username\">\r\n            </div>\r\n\r\n            <div class=\"form-group modern-input\">\r\n                <label for=\"password\">Contraseña</label>\r\n                <input type=\"password\" id=\"password\" name=\"password\" placeholder=\"••••••••\" required autocomplete=\"current-password\">\r\n            </div>\r\n\r\n            <button type=\"submit\" class=\"btn btn-primary btn-block\">Entrar</button>\r\n        </form>\r\n    </div>\r\n</body>\r\n</html>\r\n";
